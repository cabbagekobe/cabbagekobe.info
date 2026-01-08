import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// OGPキャッシュファイルのパス
const OGP_CACHE_PATH = join(process.cwd(), '.astro', 'ogp-cache.json');

// OGPキャッシュを一度だけ読み込む
let ogpCache: Record<string, OgpData> = {};
if (existsSync(OGP_CACHE_PATH)) {
  try {
    ogpCache = JSON.parse(readFileSync(OGP_CACHE_PATH, 'utf-8'));
    console.log('[ogp] Loaded OGP cache.');
  } catch (error) {
    console.error('[ogp] Error loading OGP cache:', error);
  }
}

/**
 * OGPデータの型定義
 */
export interface OgpData {
  title: string | null;
  description: string | null;
  image: string | null;
  url: string;
  siteName?: string;
  fallback?: boolean;
}

/**
 * URLに対応するOGPデータをキャッシュから取得します。
 * @param url OGPデータを取得したいURL。
 * @returns OGPデータ、またはキャッシュに存在しない場合はnull。
 */
export function getOgp(url: string): OgpData | null {
  return ogpCache[url] || null;
}
