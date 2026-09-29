/**
 * Best-effort in-memory sliding-window rate limiter. State lives per server
 * instance, so on serverless it throttles bursts rather than enforcing a global
 * limit — adequate for a small event form without adding infrastructure.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_TRACKED_KEYS = 5000;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);

  if (hits.size > MAX_TRACKED_KEYS) {
    for (const [trackedKey, timestamps] of hits) {
      if (timestamps.every((timestamp) => now - timestamp >= WINDOW_MS)) hits.delete(trackedKey);
    }
    // Still oversized (sustained flood of unique IPs): drop oldest entries.
    while (hits.size > MAX_TRACKED_KEYS) {
      const oldest = hits.keys().next().value;
      if (oldest === undefined) break;
      hits.delete(oldest);
    }
  }

  return false;
}
