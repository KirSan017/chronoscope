import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildEventsQuery, parseWikidataResponse, fetchEvents } from "@/lib/wikidata";

describe("buildEventsQuery", () => {
  it("builds a SPARQL query for a date range and category", () => {
    const query = buildEventsQuery(1800, 1900, "politics");
    expect(query).toContain("SELECT");
    expect(query).toContain("wdt:P31");
    expect(query).toContain("1800");
    expect(query).toContain("1900");
  });
  it("builds a persons query when category is person", () => {
    const query = buildEventsQuery(1800, 1900, "person");
    expect(query).toContain("wdt:P569");
  });
});

describe("parseWikidataResponse", () => {
  it("parses SPARQL JSON response into HistoryEvent array", () => {
    const raw = { results: { bindings: [{
      item: { value: "http://www.wikidata.org/entity/Q362" },
      itemLabel: { value: "Отечественная война 1812 года" },
      date: { value: "1812-06-24T00:00:00Z" },
      article: { value: "https://ru.wikipedia.org/wiki/Отечественная_война_1812_года" },
    }]}};
    const events = parseWikidataResponse(raw, "politics");
    expect(events).toHaveLength(1);
    expect(events[0].id).toBe("Q362");
    expect(events[0].title).toBe("Отечественная война 1812 года");
    expect(events[0].dateStart).toBe("1812-06-24");
    expect(events[0].category).toBe("politics");
    expect(events[0].wikiUrl).toBe("https://ru.wikipedia.org/wiki/Отечественная_война_1812_года");
  });
  it("skips entries without required fields", () => {
    const raw = { results: { bindings: [{ item: { value: "http://www.wikidata.org/entity/Q1" } }]}};
    expect(parseWikidataResponse(raw, "politics")).toHaveLength(0);
  });
});

describe("fetchEvents", () => {
  beforeEach(() => { vi.restoreAllMocks(); });
  it("fetches and parses events from Wikidata", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true, json: () => Promise.resolve({ results: { bindings: [{
        item: { value: "http://www.wikidata.org/entity/Q100" },
        itemLabel: { value: "Test Event" },
        date: { value: "1850-01-01T00:00:00Z" },
        article: { value: "https://ru.wikipedia.org/wiki/Test" },
      }]}})
    } as Response);
    const events = await fetchEvents(1800, 1900, "science");
    expect(events).toHaveLength(1);
    expect(events[0].title).toBe("Test Event");
    expect(events[0].category).toBe("science");
  });
  it("returns empty array on network error", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Network error"));
    expect(await fetchEvents(1800, 1900, "science")).toEqual([]);
  });
});
