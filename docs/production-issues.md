# Production-only issues

Discrepancies between local (`next dev`) and production (Vercel) behavior for
simulator cases. Each entry: what was observed, root cause, options — no fix
applied yet, decision pending.

---

## Case 5 (Waterfall) — TTFB does not rise on Vercel production

**Status:** Diagnosed, not fixed. Decision pending.

### Symptom

Toggling Waterfall ON reproduces the correct multi-second delay locally
(`next dev`) — TTFB in the Performance Panel tracks it closely. On the
Vercel production deployment, the page visibly takes just as long to load,
but the Performance Panel's TTFB reading stays near 0 regardless of toggle
state.

### Investigation trail

1. Confirmed the server-side logic is correct: `curl -b "waterfall=on"` vs
   `-b "waterfall=off"` against the prod URL shows a real difference
   (~4s vs ~0.4s in `time_starttransfer`), and `X-Vercel-Cache: MISS` /
   `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`
   rule out CDN/edge caching.
2. Ruled out cookie delivery issues (verified via Network tab request
   headers) and ruled out Chrome speculative prerendering
   (`activationStart: 0` in the real navigation entry — not a prerendered
   navigation).
3. Ruled out HTTP 103 Early Hints being invisible to curl as a red herring
   turned out to be the actual mechanism — confirmed via the full
   `PerformanceNavigationTiming` entry captured in the browser right after a
   real toggle-triggered `window.location.reload()`:

   ```json
   {
     "nextHopProtocol": "h2",
     "firstInterimResponseStart": 239.6,
     "responseStart": 239.6,
     "finalResponseHeadersStart": 3297.3,
     "responseEnd": 3613,
     "type": "reload"
   }
   ```

### Root cause

`responseStart` is numerically identical to `firstInterimResponseStart`.
Vercel serves an HTTP/2 **103 Early Hints** interim response (carrying the
`Link: rel=preload` hints Next.js emits for fonts) at ~240ms, well before
the real, final response — the one that actually waits on the sequential
`getCarts → getProducts → getUsers → getCategories` chain
(`components/dashboard/DashboardContentUnoptimized.tsx`) — whose headers
don't start until `finalResponseHeadersStart` (~3.3s).

`web-vitals`'s `onTTFB()` (`node_modules/web-vitals/dist/modules/onTTFB.js`)
computes `TTFB = responseStart - activationStart`. Per the Navigation
Timing spec, `responseStart` reflects the first byte of *any* response,
including a 103 interim — so on a platform that sends Early Hints, TTFB
structurally cannot capture a slow final response. Locally, `next dev`
never sends Early Hints, so `responseStart` already equals
`finalResponseHeadersStart` there — which is why the same code correctly
shows the delay in dev only.

This is not a bug in the Case 5 implementation or in the cookie/SSR
mechanism — both work correctly in production. It's a measurement-layer
mismatch between `web-vitals`'s use of `responseStart` and Vercel's Early
Hints support.

### Options considered (none applied yet)

1. Compute TTFB in `hooks/useWebVitalsReporter.ts` from
   `finalResponseHeadersStart ?? responseStart` instead of relying solely on
   `onTTFB()`. Safe for local dev too, since `finalResponseHeadersStart`
   equals `responseStart` there when no interim response occurred.
2. Document this as a known platform caveat in `docs/case5.md` instead of
   changing the metric calculation.

Decision on which option (or both) to take is deferred.
