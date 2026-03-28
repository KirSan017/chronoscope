import { describe, it, expect, beforeEach, vi } from "vitest";
import { CacheStore } from "@/lib/cache";

describe("CacheStore", () => {
  let cache: CacheStore;
  beforeEach(() => { localStorage.clear(); cache = new CacheStore("test-"); });

  it("returns null for missing key", () => { expect(cache.get("missing")).toBeNull(); });
  it("stores and retrieves a value", () => {
    cache.set("key1", { data: "hello" }, 60_000);
    expect(cache.get("key1")).toEqual({ data: "hello" });
  });
  it("returns null for expired entry", () => {
    vi.useFakeTimers();
    cache.set("key1", { data: "hello" }, 1);
    vi.advanceTimersByTime(10);
    expect(cache.get("key1")).toBeNull();
    vi.useRealTimers();
  });
  it("uses prefix to namespace keys", () => {
    cache.set("k", "v", 60_000);
    expect(localStorage.getItem("test-k")).not.toBeNull();
    expect(localStorage.getItem("k")).toBeNull();
  });
});
