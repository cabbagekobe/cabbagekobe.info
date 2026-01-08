import type { Article } from './types';

/**
 * 記事が公開可能かどうかを判定します。
 * 下書き状態でない、または公開日が未来でない場合にtrueを返します。
 * @param frontmatter 判定対象の記事のフロントマター。
 * @param isPreview プレビューモードかどうか。trueの場合、下書きや未来日付でも表示可能とします。
 * @returns 記事が可視である場合はtrue、そうでない場合はfalse。
 */
export function isArticleVisible(
  frontmatter: Article['frontmatter'],
  isPreview: boolean = false,
): boolean {
  // プレビューモードの場合は常に表示可能
  if (isPreview) {
    return true;
  }

  // 下書き記事かどうか
  const isDraft = frontmatter.draft === true;
  // 公開日が未来かどうか
  const isFutureDated =
    frontmatter.published_at && new Date(frontmatter.published_at) > new Date();

  // 下書きでもなく、未来日付でもない場合に表示可能
  return !(isDraft || isFutureDated);
}
