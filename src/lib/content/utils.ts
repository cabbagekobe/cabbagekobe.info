/**
 * 記事のパーマリンクを生成します。
 * 生成されるページ（`/articles/{slug}/index.html`）や sitemap・RSS と一致するよう、
 * 末尾スラッシュ付きで返します。
 * @param slug 記事のスラッグ
 * @returns パーマリンク文字列
 */
export function buildPermalink(slug: string): string {
  return `/articles/${slug}/`;
}

/**
 * Dateオブジェクトを'ja-JP'ロケールの'yyyy/MM/dd'形式にフォーマットします。
 * @param date フォーマットする日付。
 * @returns フォーマットされた日付文字列。
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
