# build it: docker build -t socialchangelab/media-impact-monitor --build-arg VCS_REF=$(git rev-parse --short HEAD) --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') .
# run it: docker run -p 8000:8000 -e MEDIACLOUD_API_TOKEN="${MEDIACLOUD_API_TOKEN}" -e ACLED_EMAIL="${ACLED_EMAIL}" -e ACLED_KEY="${ACLED_KEY}" socialchangelab/media-impact-monitor
FROM --platform=linux/amd64 ghcr.io/astral-sh/uv:python3.12-bookworm
WORKDIR /app/
COPY backend-python/pyproject.toml backend-python/uv.lock backend-python/README.md backend-python/manage.py ./
COPY backend-python/media_impact_monitor/__init__.py ./media_impact_monitor/
RUN uv sync --frozen
COPY backend-python/django_project/ /app/django_project/
COPY backend-python/media_impact_monitor/ /app/media_impact_monitor/
# set git commit and build date
ARG VCS_REF
ARG BUILD_DATE
ENV VCS_REF=$VCS_REF
ENV BUILD_DATE=$BUILD_DATE
# run the application
CMD ["uv", "run", "manage.py", "runserver", "0.0.0.0:80"]
# OCI Labels as per https://github.com/opencontainers/image-spec/blob/main/annotations.md
LABEL org.opencontainers.image.title="media-impact-monitor"
LABEL org.opencontainers.image.description="Media Impact Monitor"
LABEL org.opencontainers.image.authors="Social Change Lab"
LABEL org.opencontainers.image.url="https://hub.docker.com/repository/docker/socialchangelab/media-impact-monitor"
LABEL org.opencontainers.image.source="https://github.com/SocialChangeLab/media-impact-monitor"
LABEL org.opencontainers.image.created=${BUILD_DATE}
LABEL org.opencontainers.image.revision=${VCS_REF}
