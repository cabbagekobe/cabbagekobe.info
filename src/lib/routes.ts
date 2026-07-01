import fs from 'node:fs';
import fg from 'fast-glob';
import matter from 'gray-matter';
import type { Frontmatter } from './content/types';
import { buildPermalink, getEntrySlug } from './content/utils';

interface ArticleRouteData {
  frontmatter: Frontmatter;
  slug: string;
  permalink: string;
}

// すべての記事 (.md / .mdx) を読み込むヘルパー関数 (listAllRoutes関数内で使用)
async function loadAllArticles(): Promise<ArticleRouteData[]> {
  const articleFiles = await fg('src/content/articles/**/*.{md,mdx}');

  const allArticles = articleFiles.map((filepath) => {
    const raw = fs.readFileSync(filepath, 'utf-8');
    const { data } = matter(raw);
    const frontmatter = data as Frontmatter;
    const slug = getEntrySlug(filepath); // ファイルパスからスラッグを抽出
    const permalink = buildPermalink(slug, frontmatter.permalink);

    return { frontmatter, slug, permalink };
  });

  return allArticles;
}

export async function listAllRoutes(): Promise<string[]> {
  const routes = new Set<string>();

  // 1. Static pages
  const staticPageFiles = await fg('src/pages/**/*.astro', {
    ignore: ['src/pages/**/[*.astro'], // Ignore dynamic routes
  });

  for (const file of staticPageFiles) {
    let route = file
      .replace('src/pages', '')
      .replace(/index\.astro$/, '')
      .replace(/\.astro$/, '/');
    if (!route.startsWith('/')) {
      route = `/${route}`;
    }
    routes.add(encodeURI(route));
  }

  // 2. Article pages
  routes.add('/articles/'); // Add the base articles listing page
  const allArticles = await loadAllArticles();
  for (const article of allArticles) {
    routes.add(encodeURI(article.permalink));
  }

  return Array.from(routes).sort();
}
