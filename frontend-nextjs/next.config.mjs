import { withSentryConfig } from '@sentry/nextjs/config'
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js'
import { watch } from 'node:fs'
import { buildContent } from './scripts/build-content.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
 reactStrictMode: true,
 async redirects() {
  return [{ source: '/docs', destination: '/docs/introduction', permanent: false }]
 },
}

export default async function config(phase) {
 await buildContent()
 if (phase === PHASE_DEVELOPMENT_SERVER) {
  // Recompile docs during development without restarting the Next.js server.
  let pending = Promise.resolve()
  watch(new URL('./src/content', import.meta.url), { recursive: true, persistent: false }, () => {
   pending = pending.then(() => buildContent()).catch(error => { console.error(error) })
  })
 }
 return withSentryConfig(nextConfig, {
  org: 'social-change-lab',
  project: 'media-impact-monitor-frontend',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  sourcemaps: { deleteSourcemapsAfterUpload: true },
 })
}
