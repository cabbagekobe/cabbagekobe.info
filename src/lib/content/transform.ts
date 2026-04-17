// エントリをArticleオブジェクトに変換するユーティリティ関数
import type { Entry } from 'astro:content';
import type { Article } from '@/lib/content/types';
import { getEntrySlug } from './utils';

/**
 * エントリをArticleオブジェクトに変換
 * @param entry Astro Content Collection エントリ
 * @returns Article オブジェクト
 */
export function transformEntryToArticle(entry: Entry<'articles'>): Article {
  const slug = getEntrySlug(entry.id);
  const permalink = entry.data.permalink || `/articles/${slug}`;
  return { ...entry, frontmatter: entry.data, permalink } as Article;
}
