import type { Article } from './types';

/**
 * 記事が公開可能かどうかを判定します。
 * 下書きでなく、かつ公開日が未来でない場合にtrueを返します。
 * @param data 判定対象の記事のフロントマター。
 * @returns 記事が可視である場合はtrue、そうでない場合はfalse。
 */
export function isArticleVisible(
  data: Pick<Article['data'], 'draft' | 'published_at'>,
): boolean {
  return !data.draft && data.published_at <= new Date();
}
