import fs from 'node:fs/promises';
import path from 'node:path';
import type { APIRoute, MarkdownInstance } from 'astro';
import { isArticleVisible } from '@/lib/content/filters';
import type { Frontmatter } from '@/lib/content/types';

// Astroのプロジェクトルートからの相対パスでコンテンツディレクトリを指定
const contentDir = path.resolve(process.cwd(), 'src/content/articles');

export async function getStaticPaths() {
  const mdxModules = import.meta.glob<MarkdownInstance<Frontmatter>>(
    '../../content/articles/**/*.mdx',
  );

  const allMdxArticles = await Promise.all(
    Object.keys(mdxModules).map(async (filepath) => {
      const { frontmatter } = await mdxModules[filepath]();
      const slug = filepath.split('/').at(-2) as string;

      return {
        frontmatter,
        slug,
      };
    }),
  );

  const articlesToBuild = import.meta.env.PROD
    ? allMdxArticles.filter(({ frontmatter }) => isArticleVisible(frontmatter))
    : allMdxArticles;

  return articlesToBuild.map((article) => ({
    params: { slug: article.slug },
  }));
}

// GETリクエストを処理するエンドポイント
export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;
  if (!slug) {
    return new Response('Slug is required', { status: 400 });
  }

  try {
    // slugに基づいてMarkdownファイルのフルパスを構築
    const articlePath = path.join(contentDir, slug, 'index.mdx');
    // ファイルの内容を読み込む
    const markdownContent = await fs.readFile(articlePath, 'utf-8');

    // Markdownの内容をレスポンスとして返す
    return new Response(markdownContent, {
      status: 200,
      headers: {
        // Content-Typeを text/markdown に設定
        'Content-Type': 'text/markdown; charset=utf-8',
      },
    });
  } catch (error) {
    // ファイルが見つからない場合などは404エラーを返す
    console.error(`[${slug}.md.ts] Error loading article:`, error);
    return new Response('Not Found', { status: 404 });
  }
};
