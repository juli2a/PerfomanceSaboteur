import { test, expect } from "@playwright/test";
import { setSsrCookie } from "./helpers";

// docs/case5.md + the streaming-order comment in
// components/dashboard/DashboardContent.tsx: off, every section streams in
// its own Suspense boundary as its own data resolves. On,
// DashboardContentUnoptimized awaits every request sequentially with no
// Suspense at all, so nothing flushes until the whole chain has settled —
// everything appears together. This file covers the two
// consequences of that (fallback presence, arrival simultaneity); the
// sequential-vs-concurrent awaiting itself is a call-order claim, covered
// instead by components/dashboard/DashboardContentUnoptimized.test.tsx.
//
// This can't be observed via page.route (Playwright only sees requests the
// *browser* makes; these five requests are fired server-side, inside the
// Server Component, and never reach the browser's network stack) — instead
// the fallback-presence checks below look for the one thing that actually
// distinguishes off from on: whether a section's Suspense fallback (its
// skeleton) ever renders at all. A fallback only ever appears when React is
// waiting on an async boundary — seeing it proves a Suspense boundary
// genuinely wraps that section; never seeing *any* fallback across a whole
// response proves the opposite, that no boundary exists anywhere on the
// page.
//
// An earlier version of this test tried to infer Suspense presence from
// *when* sections arrived in the browser — thresholds derived from the
// *_DELAY_MS constants, then (after that broke) grouping arrival times into
// "waves" with a fixed epsilon, then (after *that* turned out flaky too) a
// bare "on finishes slower than off overall" comparison. All three coupled
// the test to real, unmocked DummyJSON network timing (docs/data.md: no
// local mocks) instead of the architecture itself. After that, both tests
// moved to checking fallback presence live in the browser via
// page.locator(...).waitFor(...) — better, but still exposed to Playwright's
// own navigation/rendering races (see docs/local-notes/case5-e2e-flakiness.md,
// "Оновлення": the on test's browser-based Promise.race failed ~25% of the
// time on known-good code, for reasons never fully pinned down as
// fallback-related vs. a Playwright-side race).
//
// Both fallback-presence checks now fetch the server's raw HTML directly
// (context.request, no browser, no JS execution) instead. This isn't just a
// workaround for the flakiness above — it's a strictly stronger claim.
// Streaming SSR means a Suspense fallback's markup (e.g.
// data-skeleton="kpi-grid") only ever enters the HTTP response's byte stream
// if a <Suspense> boundary actually exists and its child hadn't resolved yet
// when the shell was serialized; without a boundary there's nothing to
// "hold back" and nothing to send a fallback for, so those bytes can't
// appear at all. Checking the complete response text for that substring
// asks "did the server's output ever contain fallback markup," a fact about
// what got sent — not "did Playwright happen to observe it before the DOM
// moved on," which is what the old browser-based checks actually asked. The
// on test's remaining browser-based check (below) verifies something the
// raw HTML genuinely can't: that all 5 sections paint in the same instant,
// not merely that they're all present somewhere in a completed response.
//
// FALLBACK_SECTIONS deliberately excludes "top-products" (the banner) from
// the must-show-a-fallback assertion, in both tests. Every other section
// carries a real 400-800ms artificial delay (lib/server/dashboard.ts),
// which comfortably outlasts however long Next takes to construct and flush
// the initial shell — their fallback reliably makes it into that first
// flush. The banner has *no* artificial delay, so it's racing the shell
// construction on nothing but its own real, unmocked DummyJSON round-trip:
// confirmed empirically (repeated runs against a production build) that its
// fallback sometimes never enters the response at all — not a timing miss
// on the observer's side, but a decision React makes once, synchronously,
// while building the shell: if a Suspense-wrapped promise has already
// resolved by then, React renders the resolved value directly into the
// shell and never emits the fallback's markup at all, not even briefly.
// Switching the observer from a browser to a raw HTTP request doesn't
// change that — it's the same race either way, on the server, before any
// client (browser or otherwise) ever sees a byte. That makes fallback
// presence fundamentally non-deterministic for this one section, so it's
// still covered by the content-presence check (data-section), just not by
// the fallback-must-appear assertion.
const SECTIONS = [
  "top-products",
  "kpi-grid",
  "sales-chart",
  "analytics-pair",
  "analytics-grid",
] as const;

const FALLBACK_SECTIONS = SECTIONS.filter((s) => s !== "top-products");

test("off: server streams a Suspense fallback for every section but the banner, then every section's resolved content", async ({
  context,
  baseURL,
}) => {
  await setSsrCookie(context, baseURL!, "waterfall", "off");

  // context.request shares this test's BrowserContext (and its cookie jar,
  // already carrying the "off" cookie from setSsrCookie above) without
  // opening a page — response.text() waits for the whole streamed response
  // to finish, so by the time it resolves the concatenated bytes contain
  // both the initial shell (fallbacks that hadn't resolved yet) and every
  // later flush (resolved content + the inline scripts that swap it in).
  const response = await context.request.get("/dashboard");
  const html = await response.text();

  for (const section of FALLBACK_SECTIONS) {
    expect(html).toContain(`data-skeleton="${section}"`);
  }
  for (const section of SECTIONS) {
    expect(html).toContain(`data-section="${section}"`);
  }
});

test("on: server responds with fully-resolved HTML in one flush, no Suspense fallback markup anywhere in it", async ({
  context,
  baseURL,
}) => {
  await setSsrCookie(context, baseURL!, "waterfall", "on");

  // Same context.request approach as the off test above — no browser, no
  // navigation, just the raw bytes the server actually sent. Every section
  // is included here (unlike FALLBACK_SECTIONS in the off test): the banner's
  // shell-serialization race only matters when a Suspense boundary exists to
  // race against; DashboardContentUnoptimized never wraps *anything* in
  // Suspense, banner included, so there's no boundary for any section here
  // to skip a fallback *from* — the absence claim holds unconditionally.
  const response = await context.request.get("/dashboard");
  const html = await response.text();

  for (const section of SECTIONS) {
    expect(html).not.toContain(`data-skeleton="${section}"`);
    expect(html).toContain(`data-section="${section}"`);
  }
});

test("on: every section appears in the same instant", async ({
  page,
  context,
  baseURL,
}) => {
  await setSsrCookie(context, baseURL!, "waterfall", "on");
  await page.goto("/dashboard", { waitUntil: "commit" });

  const contentLocators = SECTIONS.map((section) =>
    page.locator(`[data-section="${section}"]`).first(),
  );

  // Simultaneity, checked separately from the no-fallback-in-the-HTML claim
  // in the previous test: whichever section's content becomes visible
  // first, the rest must already be visible at that exact instant — not
  // eventually, right then, no waiting. This is a distinct claim from "no
  // fallback markup anywhere in the response": a fallback never appearing
  // doesn't by itself prove there's no Suspense boundary at all — a
  // fast-enough resolve can skip a real fallback entirely (confirmed for
  // the banner in the "off" test). If Suspense boundaries were ever
  // reintroduced here and every section happened to resolve fast enough to
  // always skip its own fallback, the previous test would still pass — but
  // those boundaries would let sections stream and paint independently, so
  // this simultaneity check catches it where the no-fallback check
  // couldn't.
  //
  // What none of this distinguishes: whether the four requests inside
  // DashboardContentUnoptimized are awaited sequentially or fired
  // concurrently (e.g. Promise.all) — confirmed empirically that both
  // produce an identical single flush with no fallback, since without any
  // Suspense boundary the whole component still only returns its JSX once,
  // as one atomic unit, regardless of the internal await order. That
  // specific claim (true sequential awaiting, the actual thing Case 5's bad
  // path demonstrates) can only be pinned down at the call-order level, not
  // from anything observable in the browser — see
  // DashboardContentUnoptimized.test.tsx, which asserts it deterministically
  // with controlled promises instead of real timers or network.
  await Promise.race(contentLocators.map((l) => l.waitFor({ state: "visible" })));
  for (const locator of contentLocators) {
    expect(await locator.isVisible()).toBe(true);
  }
});
