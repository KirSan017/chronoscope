import * as fs from "fs";
import * as path from "path";

const WIKIDATA_ENDPOINT = "https://query.wikidata.org/sparql";

interface WikidataBinding {
  item: { value: string };
  itemLabel: { value: string };
  date: { value: string };
  dateEnd?: { value: string };
  article: { value: string };
}

interface HistoryEvent {
  id: string;
  title: string;
  dateStart: string;
  dateEnd?: string;
  category: string;
  wikiUrl: string;
}

async function sparqlFetch(query: string): Promise<WikidataBinding[]> {
  const url = `${WIKIDATA_ENDPOINT}?query=${encodeURIComponent(query)}&format=json`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/sparql-results+json",
      "User-Agent": "ChronoScope/1.0 (https://github.com/chronoscope)",
    },
  });
  if (!res.ok) {
    console.error(`SPARQL error: ${res.status} ${res.statusText}`);
    return [];
  }
  const data = await res.json();
  return data.results.bindings;
}

function parseBindings(bindings: WikidataBinding[], category: string): HistoryEvent[] {
  return bindings
    .filter((b) => b.item?.value && b.itemLabel?.value && b.date?.value && b.article?.value)
    .map((b) => ({
      id: b.item.value.split("/").pop()!,
      title: b.itemLabel.value,
      dateStart: b.date.value.slice(0, 10),
      dateEnd: b.dateEnd?.value ? b.dateEnd.value.slice(0, 10) : undefined,
      category,
      wikiUrl: b.article.value,
    }));
}

const QUERIES: { category: string; query: string }[] = [
  {
    category: "politics",
    query: `SELECT ?item ?itemLabel ?date ?article WHERE {
      VALUES ?type { wd:Q178561 wd:Q198 wd:Q12638 wd:Q131569 }
      ?item wdt:P31 ?type . ?item wdt:P585 ?date .
      ?article schema:about ?item . ?article schema:isPartOf <https://ru.wikipedia.org/> .
      SERVICE wikibase:label { bd:serviceParam wikibase:language "ru,en" . }
    } LIMIT 1000`,
  },
  {
    category: "science",
    query: `SELECT ?item ?itemLabel ?date ?article WHERE {
      VALUES ?type { wd:Q15061650 wd:Q3533467 }
      ?item wdt:P31 ?type . ?item wdt:P585 ?date .
      ?article schema:about ?item . ?article schema:isPartOf <https://ru.wikipedia.org/> .
      SERVICE wikibase:label { bd:serviceParam wikibase:language "ru,en" . }
    } LIMIT 1000`,
  },
  {
    category: "culture",
    query: `SELECT ?item ?itemLabel ?date ?article WHERE {
      VALUES ?type { wd:Q7725634 wd:Q11424 wd:Q8261 }
      ?item wdt:P31 ?type . ?item wdt:P577 ?date .
      ?article schema:about ?item . ?article schema:isPartOf <https://ru.wikipedia.org/> .
      SERVICE wikibase:label { bd:serviceParam wikibase:language "ru,en" . }
    } LIMIT 1000`,
  },
  {
    category: "person",
    query: `SELECT ?item ?itemLabel ?date ?dateEnd ?article WHERE {
      ?item wdt:P31 wd:Q5 .
      ?item wdt:P569 ?date .
      OPTIONAL { ?item wdt:P570 ?dateEnd . }
      ?item wdt:P166 ?award . ?award wdt:P31/wdt:P279* wd:Q618779 .
      ?article schema:about ?item . ?article schema:isPartOf <https://ru.wikipedia.org/> .
      SERVICE wikibase:label { bd:serviceParam wikibase:language "ru,en" . }
    } LIMIT 2000`,
  },
];

async function main() {
  console.log("Building events.json from Wikidata...");
  const allEvents: HistoryEvent[] = [];

  for (const { category, query } of QUERIES) {
    console.log(`  Fetching ${category}...`);
    const bindings = await sparqlFetch(query);
    const events = parseBindings(bindings, category);
    console.log(`    Got ${events.length} events`);
    allEvents.push(...events);
    await new Promise((r) => setTimeout(r, 2000));
  }

  const unique = Array.from(new Map(allEvents.map((e) => [e.id, e])).values());
  console.log(`Total unique events: ${unique.length}`);

  const outDir = path.resolve(__dirname, "../data");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "events.json"), JSON.stringify(unique, null, 2));
  console.log("Done! Written to data/events.json");
}

main().catch(console.error);
