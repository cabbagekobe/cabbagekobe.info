import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * OGPキャッシュファイルのパス。
 * 取得スクリプト（src/scripts/fetch-ogp.ts）が書き込み、getOgp が読み込みます。
 */
export const OGP_CACHE_PATH = join(process.cwd(), '.astro', 'ogp-cache.json');

/**
 * OGPデータの型定義
 */
export type OgpData = {
  title: string | null;
  description: string | null;
  image: string | null;
  url: string;
};

/**
 * URL をキーにした OGP データのキャッシュ。取得に失敗した URL は含みません。
 */
export type OgpCache = Record<string, OgpData>;

/**
 * MDX の本文から `<OGPCard url="..." />` の URL を抽出します。
 * @param content MDX ファイルの内容。
 * @returns 出現順の URL の配列。
 */
export function extractOgpUrls(content: string): string[] {
  return [...content.matchAll(/<OGPCard\s[^>]*?url=(["'])(.*?)\1/g)].map(
    (match) => match[2],
  );
}

/**
 * OGPキャッシュファイルを読み込みます。
 * @returns キャッシュの内容。ファイルがない、または不正な場合は空のキャッシュ。
 */
export function readOgpCache(): OgpCache {
  if (!existsSync(OGP_CACHE_PATH)) {
    return {};
  }
  try {
    return JSON.parse(readFileSync(OGP_CACHE_PATH, 'utf-8'));
  } catch (error) {
    console.error('[ogp] Error loading OGP cache:', error);
    return {};
  }
}

// 初回の getOgp 呼び出しで一度だけ読み込む
let ogpCache: OgpCache | undefined;

/**
 * URLに対応するOGPデータをキャッシュから取得します。
 * @param url OGPデータを取得したいURL。
 * @returns OGPデータ、またはキャッシュに存在しない場合はnull。
 */
export function getOgp(url: string): OgpData | null {
  ogpCache ??= readOgpCache();
  return ogpCache[url] ?? null;
}
