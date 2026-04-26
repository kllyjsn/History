const PROXY_URL = 'https://api.allorigins.win/raw?url=';

export interface ScrapedArticle {
  title: string;
  content: string;
  siteName: string;
  url: string;
  excerpt: string;
  error?: string;
}

function parseWikipediaUrl(url: string): { lang: string; title: string } | null {
  const match = url.match(/([a-z]{2,3})\.wikipedia\.org\/wiki\/([^#?]+)/);
  return match ? { lang: match[1], title: decodeURIComponent(match[2]) } : null;
}

async function fetchWikipediaArticle(title: string, url: string, lang = 'en'): Promise<ScrapedArticle> {
  const apiUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts&explaintext=1&format=json&origin=*`;
  const response = await fetch(apiUrl);
  if (!response.ok) throw new Error(`Wikipedia API error: ${response.status}`);
  const data = await response.json();
  const pages = data.query.pages;
  const pageId = Object.keys(pages)[0];
  const page = pages[pageId];

  if (pageId === '-1' || !page.extract) {
    throw new Error('Wikipedia article not found');
  }

  const content = page.extract
    .split('\n')
    .filter((line: string) => line.trim().length > 0)
    .join('\n\n');

  const excerpt = content.substring(0, 300) + '...';

  return {
    title: page.title,
    content,
    siteName: 'Wikipedia',
    url,
    excerpt,
  };
}

function extractMetaContent(html: string, name: string): string {
  const ogMatch = html.match(new RegExp(`<meta[^>]*property=["']og:${name}["'][^>]*content=["']([^"']+)["']`, 'i'));
  if (ogMatch) return ogMatch[1];
  const metaMatch = html.match(new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']+)["']`, 'i'));
  if (metaMatch) return metaMatch[1];
  return '';
}

function extractTitle(html: string): string {
  const ogTitle = extractMetaContent(html, 'title');
  if (ogTitle) return ogTitle;
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : '';
}

function stripNonContent(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(noscript|iframe|form|input|select|textarea)[\s\S]*?<\/\1>/gi, '');
}

function htmlToReadableText(html: string): string {
  let cleaned = stripNonContent(html);

  const articleMatch = cleaned.match(/<article[\s\S]*?<\/article>/i);
  const mainMatch = cleaned.match(/<main[\s\S]*?<\/main>/i);
  const bodyContentMatch = cleaned.match(/<div[^>]*(?:class|id)=["'][^"']*(?:mw-body-content|mw-content-text|mw-parser-output|content|article-body|post-content|entry-content|story-body)[\s\S]*/i);

  const contentHtml = articleMatch?.[0] ?? mainMatch?.[0] ?? bodyContentMatch?.[0] ?? cleaned;

  let text = contentHtml
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '  \u2022 ')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<h([1-6])[^>]*>/gi, (_m, level) => '\n\n' + '#'.repeat(Number(level)) + ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, '\u2019')
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&rdquo;/g, '\u201D')
    .replace(/&ldquo;/g, '\u201C')
    .replace(/&mdash;/g, '\u2014')
    .replace(/&ndash;/g, '\u2013')
    .replace(/&#\d+;/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n\n');

  const lines = text.split('\n\n');
  const filtered = lines.filter(line => {
    if (line.length < 15) return false;
    if (/^(cookie|privacy policy|subscribe|sign up|log in|advertisement|share this|follow us on)/i.test(line)) return false;
    if (/^(\u00A9|copyright \d|all rights reserved)/i.test(line)) return false;
    return true;
  });

  return filtered.join('\n\n').trim();
}

export async function scrapeArticle(url: string): Promise<ScrapedArticle> {
  try {
    const wiki = parseWikipediaUrl(url);
    if (wiki) {
      return await fetchWikipediaArticle(wiki.title, url, wiki.lang);
    }

    const proxyUrl = PROXY_URL + encodeURIComponent(url);
    const response = await fetch(proxyUrl, {
      headers: { 'Accept': 'text/html' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    const title = extractTitle(html);
    const siteName = extractMetaContent(html, 'site_name') || new URL(url).hostname.replace('www.', '');
    const description = extractMetaContent(html, 'description');
    const content = htmlToReadableText(html);

    if (!content || content.length < 50) {
      return {
        title: title || 'Article',
        content: '',
        siteName,
        url,
        excerpt: description || '',
        error: 'Could not extract readable content from this page. The site may block automated access or use JavaScript rendering.',
      };
    }

    const excerpt = description || content.substring(0, 200) + '...';

    return { title: title || 'Untitled Article', content, siteName, url, excerpt };
  } catch (err) {
    return {
      title: 'Error',
      content: '',
      siteName: '',
      url,
      excerpt: '',
      error: err instanceof Error ? err.message : 'Failed to load article',
    };
  }
}

export function buildSearchUrl(query: string): string {
  return `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;
}

export function buildWikipediaUrl(topic: string): string {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(topic.replace(/ /g, '_'))}`;
}

export function guessArticleUrls(conflictName: string, source: string): { label: string; url: string }[] {
  const urls: { label: string; url: string }[] = [];

  const wikiTitle = conflictName.replace(/ /g, '_');
  urls.push({
    label: `Wikipedia: ${conflictName}`,
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiTitle)}`,
  });

  urls.push({
    label: `Google Scholar: ${source}`,
    url: buildSearchUrl(source),
  });

  urls.push({
    label: `UCDP: ${conflictName}`,
    url: `https://ucdp.uu.se/#/encyclopedia?q=${encodeURIComponent(conflictName)}`,
  });

  return urls;
}
