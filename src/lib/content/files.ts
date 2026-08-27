import fs from 'node:fs';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { isArticleVisible } from './filters';
import type { Frontmatter } from './types';
import { buildPermalink, getEntrySlug } from './utils';

/**
 * fs から直接読み込んだ記事ファイルの情報。
 */
export type ArticleFile = {
  filepath: string;
  slug: string;
  permalink: string;
  frontmatter: Frontmatter;
};

/**
 * すべての記事ファイル (.md / .mdx) を fs から直接読み込みます。
 * Astro の Content Collection を経由できない箇所
 * (生 Markdown 配信エンドポイント・ルート列挙スクリプト)で使用します。
 *
 * 注意: ここで得る slug は生のディレクトリ名で、Collection 側 (glob ローダー)
 * は githubSlug() 適用後の値になる。ディレクトリ名を小文字英数字とハイフン・
 * アンダースコアに限定する `npm run new:article` の生成規則により一致が保たれる。
 * @returns 記事ファイル情報の配列。
 */
export async function loadArticleFiles(): Promise<ArticleFile[]> {
  const articleFiles = await fg('src/content/articles/**/*.{md,mdx}');

  return articleFiles.map((filepath) => {
    const raw = fs.readFileSync(filepath, 'utf-8');
    const { data } = matter(raw);
    const frontmatter = data as Frontmatter;
    const slug = getEntrySlug(filepath);
    const permalink = buildPermalink(slug, frontmatter.permalink);

    return { filepath, slug, permalink, frontmatter };
  });
}

/**
 * 配信対象の記事ファイルのみに絞り込みます。
 * 下書き・未来日付の記事の漏洩防止に使用します。
 * @param files 記事ファイルの配列。
 * @param isPreview プレビューモードかどうか。trueの場合は下書き・未来日付も含めます。
 * @returns 配信対象の記事ファイルの配列。
 */
export function filterVisibleArticleFiles(
  files: ArticleFile[],
  isPreview: boolean = false,
): ArticleFile[] {
  return files.filter((file) => isArticleVisible(file.frontmatter, isPreview));
}
