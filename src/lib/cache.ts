interface CacheEntry<T> { value: T; expiresAt: number; }

export class CacheStore {
  constructor(private prefix: string) {}

  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      if (!raw) return null;
      const entry: CacheEntry<T> = JSON.parse(raw);
      if (Date.now() > entry.expiresAt) { localStorage.removeItem(this.prefix + key); return null; }
      return entry.value;
    } catch { return null; }
  }

  set<T>(key: string, value: T, ttlMs: number): void {
    const entry: CacheEntry<T> = { value, expiresAt: Date.now() + ttlMs };
    try { localStorage.setItem(this.prefix + key, JSON.stringify(entry)); } catch {}
  }
}
