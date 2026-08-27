// エントリをArticleオブジェクトに変換するユーティリティ関数
import type { CollectionEntry } from 'astro:content';
import type { Article } from '@/lib/content/types';
import { buildPermalink } from './utils';

/**
 * エントリをArticleオブジェクトに変換
 * Content Layer の entry.id は slug そのもの（例: `20240101-slug`）
 * @param entry Astro Content Collection エントリ
 * @returns Article オブジェクト
 */
export function transformEntryToArticle(
  entry: CollectionEntry<'articles'>,
): Article {
  const permalink = buildPermalink(entry.id, entry.data.permalink);
  return { ...entry, permalink };
}
