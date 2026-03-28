import type { Category, HistoryEvent } from "@/types";

const WIKIDATA_ENDPOINT = "https://query.wikidata.org/sparql";

const EVENT_TYPES: Record<Exclude<Category, "person">, string> = {
  politics: "wd:Q178561 wd:Q198 wd:Q12638 wd:Q131569 wd:Q7283",
  science: "wd:Q15061650 wd:Q12136 wd:Q35120",
  culture: "wd:Q7725634 wd:Q11424 wd:Q5398426 wd:Q8261",
  religion: "wd:Q9174 wd:Q1088552",
  technology: "wd:Q39546 wd:Q11012 wd:Q28865",
};

export function buildEventsQuery(startYear: number, endYear: number, category: Category): string {
  const startDate = startYear < 0
    ? `"-${String(Math.abs(startYear)).padStart(4, "0")}-01-01T00:00:00Z"^^xsd:dateTime`
    : `"${String(startYear).padStart(4, "0")}-01-01T00:00:00Z"^^xsd:dateTime`;
  const endDate = endYear < 0
    ? `"-${String(Math.abs(endYear)).padStart(4, "0")}-12-31T00:00:00Z"^^xsd:dateTime`
    : `"${String(endYear).padStart(4, "0")}-12-31T00:00:00Z"^^xsd:dateTime`;

  if (category === "person") {
    return `SELECT ?item ?itemLabel ?date ?dateEnd ?article WHERE {
      ?item wdt:P31 wd:Q5 . ?item wdt:P569 ?date .
      OPTIONAL { ?item wdt:P570 ?dateEnd . }
      ?article schema:about ?item . ?article schema:isPartOf <https://ru.wikipedia.org/> .
      FILTER(?date >= ${startDate} && ?date <= ${endDate})
      SERVICE wikibase:label { bd:serviceParam wikibase:language "ru,en" . }
    } LIMIT 200`;
  }

  return `SELECT ?item ?itemLabel ?date ?article WHERE {
    VALUES ?type { ${EVENT_TYPES[category]} }
    ?item wdt:P31 ?type . ?item wdt:P585 ?date .
    ?article schema:about ?item . ?article schema:isPartOf <https://ru.wikipedia.org/> .
    FILTER(?date >= ${startDate} && ?date <= ${endDate})
    SERVICE wikibase:label { bd:serviceParam wikibase:language "ru,en" . }
  } LIMIT 200`;
}

interface WikidataBinding { item?: { value: string }; itemLabel?: { value: string }; date?: { value: string }; dateEnd?: { value: string }; article?: { value: string }; }
interface WikidataResponse { results: { bindings: WikidataBinding[] }; }

export function parseWikidataResponse(raw: WikidataResponse, category: Category): HistoryEvent[] {
  return raw.results.bindings
    .filter((b) => b.item?.value && b.itemLabel?.value && b.date?.value && b.article?.value)
    .map((b) => ({
      id: b.item!.value.split("/").pop()!,
      title: b.itemLabel!.value,
      dateStart: b.date!.value.slice(0, 10),
      dateEnd: b.dateEnd?.value ? b.dateEnd.value.slice(0, 10) : undefined,
      category,
      wikiUrl: b.article!.value,
    }));
}

export async function fetchEvents(startYear: number, endYear: number, category: Category): Promise<HistoryEvent[]> {
  const query = buildEventsQuery(startYear, endYear, category);
  try {
    const response = await fetch(`${WIKIDATA_ENDPOINT}?query=${encodeURIComponent(query)}&format=json`, {
      headers: { Accept: "application/sparql-results+json" },
    });
    if (!response.ok) return [];
    const data: WikidataResponse = await response.json();
    return parseWikidataResponse(data, category);
  } catch { return []; }
}
