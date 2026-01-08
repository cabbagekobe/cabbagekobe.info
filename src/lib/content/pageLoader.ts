import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import type { Frontmatter } from './types'; // Assuming Frontmatter type is generic enough

/**
 * 静的ページを表すインターフェース。
 */
interface Page {
  slug: string; // ページのスラッグ
  filepath: string; // ファイルパス
  permalink: string; // ページのパーマリンク
  frontmatter: Frontmatter; // フロントマターデータ
  html: string; // 変換されたHTMLコンテンツ
  markdown: string; // オリジナルMarkdownコンテンツ
  raw: string; // ファイルの生コンテンツ
}

/**
 * 指定された相対パスのMarkdownファイルを読み込み、Pageオブジェクトを返します。
 * @param relativePath コンテンツディレクトリからの相対パス（例: 'pages/about.md'）。
 * @returns 読み込まれたPageオブジェクト、またはファイルが見つからない場合はnull。
 */
export function loadPage(relativePath: string): Page | null {
  const fullPath = path.join('content', relativePath); // 完全なファイルパスを構築

  // ファイルが存在しない場合はnullを返す
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const raw = fs.readFileSync(fullPath, 'utf-8'); // ファイル内容を読み込み
  const { data, content } = matter(raw); // フロントマターとコンテンツをパース
  const fm = data as Frontmatter; // フロントマターを型アサーション

  const html = marked.parse(content ?? ''); // MarkdownコンテンツをHTMLに変換

  // パスからシンプルなスラッグを生成 (例: 'pages/about.md' -> 'pages-about')
  const slug = relativePath.replace(/\.md$/, '').replace(/\//g, '-');
  // パスからパーマリンクを生成 (例: 'pages/about.md' -> '/pages/about')
  const permalink = `/${relativePath.replace(/\.md$/, '')}`;

  return {
    slug,
    filepath: fullPath,
    permalink,
    frontmatter: fm,
    html,
    markdown: content,
    raw,
  };
}
