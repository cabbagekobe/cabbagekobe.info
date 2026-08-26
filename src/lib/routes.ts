import fg from 'fast-glob';
import { loadArticleFiles } from './content/files';

/**
 * サイト内のすべてのルート(静的ページ + 記事ページ)を列挙します。
 * @returns ソート済みのルートパスの配列。
 */
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
  const allArticles = await loadArticleFiles();
  for (const article of allArticles) {
    routes.add(encodeURI(article.permalink));
  }

  return Array.from(routes).sort();
}
