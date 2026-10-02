import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import fg from 'fast-glob';
import ogs from 'open-graph-scraper';
import {
  extractOgpUrls,
  OGP_CACHE_PATH,
  type OgpCache,
  readOgpCache,
} from '../lib/ogp';

async function fetchOgpData(): Promise<void> {
  console.log('[fetch-ogp] Starting OGP data fetching...');

  // OGPCard は MDX コンポーネントなので .mdx のみを対象にする
  const mdxFiles = await fg('src/content/articles/**/*.mdx');
  const urls = new Set(
    mdxFiles.flatMap((file) => extractOgpUrls(readFileSync(file, 'utf-8'))),
  );
  console.log(
    `[fetch-ogp] Found ${urls.size} unique URLs in ${mdxFiles.length} MDX files.`,
  );

  // 取得済みの URL は再取得しない。
  // 取得に失敗した URL はキャッシュに書かないので、次回の実行で再試行される
  const existingCache = readOgpCache();
  const ogpCache: OgpCache = {};

  for (const url of urls) {
    if (existingCache[url]) {
      ogpCache[url] = existingCache[url];
      continue;
    }

    try {
      console.log(`[fetch-ogp] Fetching OGP for: ${url}`);
      const { result } = await ogs({ url });
      ogpCache[url] = {
        title: result.ogTitle ?? null,
        description: result.ogDescription ?? null,
        image: result.ogImage?.[0]?.url ?? null,
        url: result.requestUrl ?? url,
      };
    } catch (error) {
      // open-graph-scraper は取得失敗時に { error, result } で reject する
      const reason = (error as { result?: { error?: string } }).result?.error;
      console.warn(
        `[fetch-ogp] Failed to fetch OGP for ${url}: ${reason ?? error}`,
      );
    }
  }

  mkdirSync(dirname(OGP_CACHE_PATH), { recursive: true });
  writeFileSync(OGP_CACHE_PATH, JSON.stringify(ogpCache, null, 2), 'utf-8');
  console.log(`[fetch-ogp] OGP data saved to ${OGP_CACHE_PATH}`);
}

fetchOgpData();
