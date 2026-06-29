/**
 * Lightweight in-process TTL cache.
 *
 * Suitable for caching expensive, frequently-read DB queries (homepage, top
 * articles, journal listings, search suggestions, metrics snapshots) where a
 * few seconds / minutes of staleness is acceptable.
 *
 * No external dependency — uses a plain Map with timestamp bookkeeping.
 * For multi-instance deployments swap this for Redis / Upstash.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class TtlCache {
  private store = new Map<string, CacheEntry<unknown>>();

  /** Read a cached value. Returns undefined on miss or expiry. */
  get<T>(key: string): T | undefined {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  /** Store a value with a TTL in milliseconds. */
  set<T>(key: string, value: T, ttlMs: number): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  /** Remove a specific key (e.g. after a write). */
  del(key: string): void {
    this.store.delete(key);
  }

  /** Invalidate all keys that start with a given prefix. */
  invalidate(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) this.store.delete(key);
    }
  }

  /** Clear everything — useful in tests. */
  flush(): void {
    this.store.clear();
  }
}

export const cache = new TtlCache();

// ── TTL constants ─────────────────────────────────────────────
export const TTL = {
  HOMEPAGE:    60_000,        // 60 s  — homepage aggregation
  TOP_ARTICLES: 120_000,      // 2 min — top/trending article lists
  METRICS:     30_000,        // 30 s  — per-article metrics snapshot
  JOURNAL:     300_000,       // 5 min — journal detail (slow-changing)
  SEARCH_SUGGESTIONS: 60_000, // 60 s  — search autocomplete
  SITE_CONFIG: 600_000,       // 10 min — site config (very slow-changing)
} as const;

/**
 * Cache-aside helper.
 *
 * Usage:
 *   const data = await cached("key", TTL.HOMEPAGE, () => expensiveQuery());
 */
export async function cached<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const hit = cache.get<T>(key);
  if (hit !== undefined) return hit;

  const value = await fetcher();
  cache.set(key, value, ttlMs);
  return value;
}
