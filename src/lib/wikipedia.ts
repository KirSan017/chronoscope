export function extractPageTitle(wikiUrl: string): string {
  const parts = wikiUrl.split("/wiki/");
  return decodeURIComponent(parts[parts.length - 1]);
}

interface ExtractResult { description: string | null; imageUrl: string | null; }

export async function fetchExtract(wikiUrl: string): Promise<ExtractResult> {
  const title = extractPageTitle(wikiUrl);
  const lang = wikiUrl.includes("ru.wikipedia") ? "ru" : "en";
  const apiUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts|pageimages&exintro=1&explaintext=1&pithumbsize=300&format=json&origin=*`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) return { description: null, imageUrl: null };
    const data = await response.json();
    const pages = data.query?.pages;
    if (!pages) return { description: null, imageUrl: null };
    const page = Object.values(pages)[0] as { extract?: string; thumbnail?: { source: string } };
    return { description: page.extract ?? null, imageUrl: page.thumbnail?.source ?? null };
  } catch { return { description: null, imageUrl: null }; }
}
