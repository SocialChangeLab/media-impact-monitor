# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Media Impact Monitor measures how protest/activism events affect public discourse. It correlates protest event data with media trends (online/print newspapers, Google Trends) and uses causal-inference statistics to estimate the _impact_ of protests on attention to their cause. Current focus: **climate** (`climate_change`) and **Gaza** (`gaza_crisis`) protests, mostly in Germany.

This is a monorepo:

- `backend-python/` — FastAPI service that loads, caches, and analyzes data. **Most data/statistics work happens here.**
- `frontend-nextjs/` — Next.js 14 (App Router) dashboard; the primary UI, visualizes the API's output.
- `frontend-observable/` — secondary/experimental Observable Framework frontend (separate npm project).
- `notebooks/` — exploratory Jupyter notebooks (research, not production).
- `docs/api.md` — public API usage examples (live docs: https://api.dev.mediaimpactmonitor.app/docs).

## Commands

### Backend (`backend-python/`)

Uses [`uv`](https://docs.astral.sh/uv/). Run from `backend-python/`.

```bash
uv sync                                                        # install deps
uv run uvicorn media_impact_monitor.api:app --reload           # serve API on :8000 (dev)
uv run --extra dev pytest                                      # run all tests
uv run --extra dev pytest -k fridays                           # run tests matching "fridays"
uv run --extra dev py-spy record -o profile.svg -- python x.py # profile a script
```

Tests live next to source as `*_test.py`. Pytest/FastAPI debug configs are in `.vscode/launch.json`. The venv lives at `backend-python/.venv`.

### Frontend (`frontend-nextjs/`)

```bash
npm install
npm run dev      # dev server on :3000
npm run build    # runs lint THEN next build (lint failures break the build)
npm run lint     # next lint --fix
```

Node `20.11.1` (`.nvmrc`). No frontend test suite. Needs `NEXT_PUBLIC_API_URL` set (template: `.env.sample`).

## Backend architecture

### API surface (`media_impact_monitor/api.py`)

POST endpoints each take a Pydantic search object and return a generic `Response[query, data]`. **Note the route names** (several are singular):

| Route                  | Method | Handler                     | What it does                                         |
| ---------------------- | ------ | --------------------------- | ---------------------------------------------------- |
| `/events`              | POST   | `events.get_events`         | Protest events, filtered by topic & organizer        |
| `/trend`               | POST   | `trend.get_trend_for_api`   | Media time series (keyword counts, topic, sentiment) |
| `/impact`              | POST   | `impact.get_impact`         | Causal estimate of an organizer's effect on a trend  |
| `/fulltexts`           | POST   | `fulltexts.get_fulltexts`   | Article fulltexts + LLM sentiment/topic coding       |
| `/policy`              | POST   | `policy.get_policy`         | Bundestag (German parliament) policy data            |
| `/organizers`          | GET    | `events.organizers_with_id` | Organizer list + slugified IDs for a topic           |
| `/fill_cache`, `/info` | GET    | —                           | Manual cache trigger; build metadata                 |

**`types_.py` is the single source of truth** for the API contract — all valid `Topic`, `MediaSource`, `EventSource`, `TrendType`, `Method`, etc. are `Literal`s here, and the frontend mirrors them as Zod schemas. Start here when changing the API shape.

### Data layers

- `data_loaders/` — one subpackage per external source. Each wraps a third-party API:
  | Source | Module | Env key |
  |---|---|---|
  | ACLED (protests) | `protest/acled/` | `ACLED_ACCESS_TOKEN` |
  | Org press releases (e.g. Last Generation) | `protest/press_releases/` | — |
  | MediaCloud (online news) | `news_online/mediacloud_.py` | `MEDIACLOUD_API_TOKEN` |
  | Genios (print news) | `news_print/genios.py` | — |
  | Google Trends (via DataForSEO) | `web/google_trends.py` | `DATAFORSEO_EMAIL/PASSWORD` |
  | TikTok (via RapidAPI) | `social_media/tiktok.py` | `RAPIDAPI_KEY` |
  | Bundestag (policy) | `policy/bundestag/` | `BUNDESTAG_API_KEY` |

  Topic/organizer membership and keyword queries are driven by `protest/climate_orgs.py`, `protest/gaza_orgs.py`, and `issue_keywords.yaml`.

- `trends/` — computes trend time series on top of loaded media data: `keyword_trend.py` (counts matching articles per source), `topic_trend.py` and `sentiment_trend.py` (both LLM-code a sample of article fulltexts). Sentiment/topic trends only support `news_online` and ~2022+.
- `impact_estimators/` — statistical models. **Only `time_series_regression.py` is active** (OLS with HC3 robust SEs, protest/media lags, weekday dummies). `interrupted_time_series.py` (ARIMA counterfactual) is commented out; synthetic control is `NotImplementedError`. `impact.py` currently hardcodes the `climate_change` topic and requires ≥5 event-days for an organizer.

### Caching is central — understand this before touching data code

External calls and expensive computations are memoized on disk via **`joblib.Memory`** in `util/cache.py` (the `@cache` decorator plus cached `get`/`post` HTTP helpers that also swallow exceptions). The cache directory is the literal `cache/` relative to the **current working directory** (no env override) — running from a different CWD silently loses the cache; in production it's a mounted persistent disk.

`cron.py` runs a daily APScheduler job (`fill_cache`, 01:00 UTC, retried at +15/30/45 min because MediaCloud often fails first try) that pre-populates the cache across every `topic × media_source × trend_type × aggregation` combination, plus events and recent fulltexts. **When adding a slow loader or estimator, wrap it with `@cache`** and consider whether `cron.py` should pre-warm it.

`trend.py` uses a caching trick: it always computes/caches the full range `2020-01-01 → today`, then slices to the requested window, so daily updates reuse prior work.

### LLM coding

`util/llm.py` routes through `litellm` → Azure OpenAI (`gpt-4o-mini`), `@cache`-wrapped. `fulltext_coding.py` uses tool/function-calling to score each article (per-subtopic 0–4 scores, `activism_sentiment` and `policy_sentiment` in {-1,0,1}); the policy-sentiment prompt differs per topic. Async with an `AsyncLimiter`; parse failures return `None`. **`AI_TREND_RESOLUTION`** (env, default `0.01`) is the fraction of articles downloaded & coded for sentiment/topic trends — keep it tiny in dev to control cost/latency.

## Frontend architecture

- **Routing** (`src/app/(pages)/`, route groups): home `/`, `/dashboard` (main analytics), `/events/[id]`, `/organisations/[slug]`, `/docs/[slug]` (MDX), and static `(info)` pages. A `@modal` **parallel/intercepting route** renders event and organisation detail pages as slide-up drawers when navigated to from within the app.
- **Data fetching pattern** (repeated per feature): a React Query hook in `src/utility/use*.ts` reads filters from the Zustand store and builds a query → a `*Util.ts` builder calls `fetchApiData` (`fetchUtil.ts`, POSTs to `${NEXT_PUBLIC_API_URL}/<endpoint>`, 4-hour ISR) → a `*Util.ts` validator parses the raw response against a **Zod schema** and transforms string dates into `Date`/comparable-date objects. Hooks: `useEvents`, `useMediaTrends`, `useMediaImpact`, `useOrganisations`, `useFullTexts`, `useFullTextsTrends`. Query keys are namespaced arrays; organizer lists are slugified+sorted into the key for stability.
- **State** (Zustand): `stores/filtersStore.ts` holds `from`/`to`/`organizers`/`mediaSource`/`topic`, persisted to **URL search params + localStorage**, validated via Zod on hydration, clamped to dataset bounds. `stores/uiStore.ts` holds scroll/layout UI state. Providers compose in `appProviders.tsx`.
- **Components** (`src/components/`): `ui/` are shadcn/ui + Radix primitives; feature charts each ship Loading/Empty/Error variants behind Suspense + ErrorBoundary. Charts use **Recharts** (line/bar) and **d3-scale/d3-time** (custom `ImpactChart`). Docs render via **Contentlayer + MDX** (`contentlayer.config.ts`, `utility/docsUtil.ts`).
- **Conventions:** path alias `@/* → src/*`. The app pins "today" to **`America/New_York`** (`utility/today.ts`) — be careful with date math. RSC file suffixes are meaningful: `*.server.tsx`, `*.client.tsx`, `*.action.ts`. Sentry is wired on client/server/edge.

## Shared conventions

- **Dates (backend):** always `datetime.date`, including inside Pandas DataFrames — do **not** use `pd.Timestamp`.
- **Formatting:** backend = **Ruff** (`F401` ignored — re-exports are intentional; 100-col ruler in devcontainer). Frontend = **Prettier with tabs, no semicolons, single quotes, trailing commas** (`prettier.config.js`) + ESLint (`next` + `prettier`). Match the file you're editing.
- New features generally span the full `topic × media_source` matrix — mirror the loops in `cron.py`.

## Workflow, CI/CD & deployment

- **Branches:** default working branch is **`dev`**; `main` is production. PRs target `dev` or `main`. Commit style is conventional commits (Commitizen recommended in the devcontainer).
- **CI** (`.github/workflows/deploy.yml`): triggers only on `backend-*/**` or workflow changes pushed/PR'd to `main`/`dev`; sets up Python 3.10 + `uv` and runs `pytest` with all the API keys from GitHub Secrets. It does **not** build/deploy — deployment is via **Railway** (set a `PORT` env var; mount a persistent disk at `/app/backend-python/cache`). The root `Dockerfile` builds the backend image (`uv`-based, uvicorn on 8000; `VCS_REF`/`BUILD_DATE` build args). `.github/workflows/add-issues-to-project.yml` auto-adds issues labeled `project` to GitHub Project #2.
- **Devcontainer** (`.devcontainer/`): Ubuntu base with Node, Python 3.10 + Ruff, R/RStudio (port 8787), Docker-in-Docker, `act`, Terraform. `postCreateCommand.sh` installs R deps, restores `renv`, and runs `uv sync`. Format-on-save + organize-imports are enforced there.
- **Tests hit real external APIs** (no network mocking) — many are `@pytest.mark.skip`ped when their source is unavailable. ACLED data is currently disabled (recent commits), so ACLED-backed events/tests will fail or skip; the code is intact and can be re-enabled.

## Team & licensing

- Core contributors (`.all-contributorsrc`): **David Pomerenke** (@davidpomerenke, data science), **Lennart Klein** (@kleinlennart, data science), **Lucas Vogel** (@vogelino, frontend/UX). Project hosted by Social Change Lab, funded by Prototype Fund (BMBF).
- **License** (`LICENSE.md`) is a combined **GPL v3 + Commons Clause (noncommercial) + NoHarm (ethical-use)** license: derivatives must be open source, no commercial or harmful use. Keep this in mind for any dependency/feature that implies redistribution.
