import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import fg from 'fast-glob';
import ogs from 'open-graph-scraper';

const urlPattern = /<OGPCard url="([^"]+)"\s*\/>/g;
const OGP_CACHE_PATH = join(process.cwd(), '.astro', 'ogp-cache.json');

async function fetchOgpData() {
  console.log('[fetch-ogp] Starting OGP data fetching...');

  const astroDir = dirname(OGP_CACHE_PATH);
  if (!existsSync(astroDir)) {
    mkdirSync(astroDir, { recursive: true });
    console.log(`[fetch-ogp] Created directory: ${astroDir}`);
  }

  const markdownFiles = await fg('src/content/articles/**/*.mdx', {
    absolute: true,
  });
  console.log(`[fetch-ogp] Found ${markdownFiles.length} Markdown files.`);

  const uniqueUrls = new Set();

  for (const file of markdownFiles) {
    const content = readFileSync(file, 'utf-8');
    const matches = [...content.matchAll(urlPattern)];
    for (const match of matches) {
      uniqueUrls.add(match[1]);
    }
  }

  console.log(`[fetch-ogp] Found ${uniqueUrls.size} unique URLs.`);

  const ogpCache = {};
  const urlsToFetch = Array.from(uniqueUrls);

  for (const url of urlsToFetch) {
    try {
      console.log(`[fetch-ogp] Fetching OGP for: ${url}`);
      const { result } = await ogs({ url });

      if (result.success) {
        ogpCache[url] = {
          title: result.ogTitle || null,
          description: result.ogDescription || null,
          // Corrected image handling for array of objects
          image:
            result.ogImage &&
            Array.isArray(result.ogImage) &&
            result.ogImage.length > 0
              ? result.ogImage[0].url
              : null,
          url: result.requestUrl,
        };
        console.log(`[fetch-ogp] Successfully fetched OGP for: ${url}`);
      } else {
        console.warn(
          `[fetch-ogp] Failed to fetch OGP for ${url}: ${result.error || 'Unknown error'}`,
        );
        ogpCache[url] = {
          title: null,
          description: null,
          image: null,
          url: url,
          fallback: true,
        };
      }
    } catch (error) {
      console.error(
        `[fetch-ogp] Error fetching OGP for ${url}: ${error.message}`,
      );
      ogpCache[url] = {
        title: null,
        description: null,
        image: null,
        url: url,
        fallback: true,
      };
    }
  }

  writeFileSync(OGP_CACHE_PATH, JSON.stringify(ogpCache, null, 2), 'utf-8');
  console.log(`[fetch-ogp] OGP data saved to ${OGP_CACHE_PATH}`);
}

fetchOgpData();
