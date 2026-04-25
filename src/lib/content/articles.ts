import { getCollection } from 'astro:content';
import { isArticleVisible } from './filters';
import { transformEntryToArticle } from './transform';
import type { Article } from './types';

/**
 * すべての記事を取得し、Article型に変換して返します。
 * @returns すべての記事の配列。
 */
export async function getAllArticles(): Promise<Article[]> {
  const entries = await getCollection('articles');
  return entries.map(transformEntryToArticle);
}

/**
 * 公開済みの記事を取得し、公開日降順でソートして返します。
 * 下書きや未来日付の記事は除外されます。
 * @returns 公開済み記事の配列（公開日降順）。
 */
export async function getAllPublishedArticles(): Promise<Article[]> {
  const articles = await getAllArticles();
  return articles
    .filter((a) => isArticleVisible(a.data))
    .sort(
      (a, b) => b.data.published_at.valueOf() - a.data.published_at.valueOf(),
    );
}

/**
 * 指定された記事に関連する記事のリストを取得します。
 * 公開日時の近い記事が優先されます。
 * @param target 基準となる記事オブジェクト。
 * @param allArticles すべての記事の配列。
 * @param max 取得する関連記事の最大数。デフォルトは5です。
 * @returns 関連記事の配列。
 */
export function getRelatedArticles(
  target: Article,
  allArticles: Article[],
  max = 5,
): Article[] {
  const others = allArticles.filter((article) => article.id !== target.id);

  const targetDate = new Date(target.data.published_at);

  const datedArticles = others.map((article) => {
    const date = new Date(article.data.published_at);
    const diff = Math.abs(date.getTime() - targetDate.getTime());
    return { article, diff };
  });

  datedArticles.sort((a, b) => a.diff - b.diff);

  return datedArticles.slice(0, max).map((item) => item.article);
}
