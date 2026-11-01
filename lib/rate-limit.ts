// Best-effort only: memory is per serverless instance and resets often.
// The real protection is the Vercel Firewall rule in the Resend guide, Part 8.
const hits = new Map<string, number[]>();

/**
 * Records one attempt for `key` and returns false once `limit` attempts fall
 * inside the window. `now` is injectable so the window can be tested.
 */
export function allow(
  key: string,
  limit = 5,
  windowMs = 10 * 60 * 1000,
  now = Date.now(),
): boolean {
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);

  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 500) {
    for (const [storedKey, times] of hits) {
      if (times.every((time) => now - time >= windowMs)) hits.delete(storedKey);
    }
  }

  return true;
}
