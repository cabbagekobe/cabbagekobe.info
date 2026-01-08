import fs from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';
import matter from 'gray-matter';

interface MdxArticleData {
  frontmatter: Frontmatter;
  slug: string;
  permalink: string;
}

// すべてのMDX記事を読み込むヘルパー関数 (listAllRoutes関数内で使用)
async function loadAllMdxArticles(): Promise<MdxArticleData[]> {
  const mdxFiles = await fg('src/content/articles/**/*.mdx');

  const allMdxArticles = mdxFiles.map((filepath) => {
    const raw = fs.readFileSync(filepath, 'utf-8');
    const { data } = matter(raw);
    const frontmatter = data as Frontmatter;
    const slug = path.basename(path.dirname(filepath)); // ファイルパスからスラッグを抽出
    const permalink = frontmatter.permalink || `/articles/${slug}`;

    return { frontmatter, slug, permalink };
  });

  return allMdxArticles;
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
  const allArticles = await loadAllMdxArticles();
  for (const article of allArticles) {
    routes.add(encodeURI(article.permalink));
  }

  return Array.from(routes).sort();
}
