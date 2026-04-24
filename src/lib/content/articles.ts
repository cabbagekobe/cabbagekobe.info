import { HOME_LABEL } from '@/lib/constants';
import type { Article, ArticlePageProps } from './types';
import { getEntrySlug, resolveCoverImagePath } from './utils';

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
  // Exclude the target article itself
  const others = allArticles.filter((article) => article.id !== target.id);

  // Get target date
  const targetDate = new Date(target.data.published_at);

  // Compute distance in time for each article
  const datedArticles = others.map((article) => {
    const date = new Date(article.data.published_at);
    const diff = Math.abs(date.getTime() - targetDate.getTime());
    return { article, diff };
  });

  // Sort by smallest difference (closest first)
  datedArticles.sort((a, b) => a.diff - b.diff);

  // Take up to max articles and return just the article objects
  return datedArticles.slice(0, max).map((item) => item.article);
}

/**
 * 記事ページをレンダリングするために必要なすべてのプロパティを準備します。
 * これは、以前 [slug].astro のフロントマターにあったロジックをカプセル化したものです。
 * @param article ターゲットとなる記事オブジェクト。
 * @param allArticles 関連記事の計算に使用するすべての記事の配列。
 * @returns 記事ページに必要なすべてのプロパティを含むオブジェクト。
 */
export async function getArticlePageProps(
  article: Article,
  allArticles: Article[],
): Promise<ArticlePageProps> {
  const frontmatter = article.data; // frontmatter を article.data から取得

  // カバー画像のパスを解決
  const coverSrc = resolveCoverImagePath(
    frontmatter.cover_image,
    getEntrySlug(article.id),
  );

  // パンくずリストを生成
  const crumbs = [{ href: '/', label: HOME_LABEL }];
  crumbs.push({ label: frontmatter.title });

  // 関連記事を取得
  const related = getRelatedArticles(article, allArticles);

  return {
    article,
    coverSrc,
    crumbs,
    related,
  };
}
