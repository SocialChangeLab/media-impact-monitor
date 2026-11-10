// Compatibility entry point for tooling that still loads this file.
// Next.js initializes Sentry through src/instrumentation-client.ts.
export { onRouterTransitionStart } from "./src/instrumentation-client";
