import type { CollectionEntry } from 'astro:content';

/**
 * 記事オブジェクトの型定義。
 * Astro の Content Collection の Entry ('articles' コレクション) を拡張
 */
export type Article = CollectionEntry<'articles'> & {
  permalink: string;
};
