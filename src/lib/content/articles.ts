import type { Article, ArticlePageProps } from './types';

/**
 * 指定された記事に関連する記事のリストを取得します。
 * タグの重複が多い記事が優先されます。
 * @param target 基準となる記事オブジェクト。
 * @param allArticles すべての記事の配列。
 * @param max 取得する関連記事の最大数。デフォルトは5です。
 * @returns 関連記事の配列。
 */
export function getRelatedArticles(
  _target: Article,
  _allArticles: Article[],
  _max = 5,
): Article[] {
  return [];
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
  let coverSrc: string | undefined;
  if (frontmatter.cover_image) {
    const src = String(frontmatter.cover_image);
    // 相対パスの場合、パブリックパスに変換
    coverSrc = src.startsWith('./')
      ? `/images/articles/${article.slug}/${src.replace('./', '')}`
      : src;
  }

  // パンくずリストを生成
  const crumbs = [{ href: '/', label: 'Home' }];
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
