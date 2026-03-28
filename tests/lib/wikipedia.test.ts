import { describe, it, expect, vi, beforeEach } from "vitest";
import { extractPageTitle, fetchExtract } from "@/lib/wikipedia";

describe("extractPageTitle", () => {
  it("extracts title from Wikipedia URL", () => {
    expect(extractPageTitle("https://ru.wikipedia.org/wiki/Пушкин")).toBe("Пушкин");
  });
  it("handles encoded URLs", () => {
    expect(extractPageTitle("https://ru.wikipedia.org/wiki/%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD")).toBe("Пушкин");
  });
});

describe("fetchExtract", () => {
  beforeEach(() => { vi.restoreAllMocks(); });
  it("fetches extract and thumbnail", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true, json: () => Promise.resolve({
        query: { pages: { "123": { extract: "Краткое описание...", thumbnail: { source: "https://upload.wikimedia.org/thumb.jpg" } } } }
      })
    } as Response);
    const result = await fetchExtract("https://ru.wikipedia.org/wiki/Test");
    expect(result.description).toBe("Краткое описание...");
    expect(result.imageUrl).toBe("https://upload.wikimedia.org/thumb.jpg");
  });
  it("returns nulls on error", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("fail"));
    const result = await fetchExtract("https://ru.wikipedia.org/wiki/Test");
    expect(result.description).toBeNull();
    expect(result.imageUrl).toBeNull();
  });
});
