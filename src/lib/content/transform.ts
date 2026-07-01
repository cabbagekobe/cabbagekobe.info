// エントリをArticleオブジェクトに変換するユーティリティ関数
import type { Entry } from 'astro:content';
import type { Article } from '@/lib/content/types';
import { buildPermalink, getEntrySlug } from './utils';

/**
 * エントリをArticleオブジェクトに変換
 * @param entry Astro Content Collection エントリ
 * @returns Article オブジェクト
 */
export function transformEntryToArticle(entry: Entry<'articles'>): Article {
  const slug = getEntrySlug(entry.id);
  const permalink = buildPermalink(slug, entry.data.permalink);
  return { ...entry, permalink };
}
