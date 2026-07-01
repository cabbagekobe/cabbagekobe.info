import type { CollectionEntry } from 'astro:content';

/**
 * 見出しの型定義。
 */
export type Heading = {
  depth: number; // 見出しのレベル (h1: 1, h2: 2, ...)
  slug: string; // 見出しのID (アンカーリンク用)
  text: string; // 見出しのテキスト内容
};

/**
 * 記事オブジェクトの型定義。
 * Astro の Content Collection の Entry ('articles' コレクション) を拡張
 */
export type Article = CollectionEntry<'articles'> & {
  permalink: string;
};

/**
 * 記事フロントマターの型定義。
 * Astro の Content Collection を経由せず、生の Markdown/MDX を
 * gray-matter や import.meta.glob で読み込む箇所で使用します。
 * content.config.ts の articles スキーマに対応します。
 */
export type Frontmatter = {
  title?: string;
  published_at?: Date;
  summary?: string;
  permalink?: string;
  draft?: boolean;
};
