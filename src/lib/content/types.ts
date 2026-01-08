/**
 * 見出しの型定義。
 */
export type Heading = {
  depth: number; // 見出しのレベル (h1: 1, h2: 2, ...)
  slug: string; // 見出しのID (アンカーリンク用)
  text: string; // 見出しのテキスト内容
};

/**
 * 記事オブジェクトの型定義。
 * Astro の Content Collection の Entry ('articles' コレクション) を拡張
 */
export type Article = CollectionEntry<'articles'> & {
  permalink: string; // permalink は CollectionEntry のデータには含まれないため、明示的に追加
};

/**
 * パンくずリストのアイテムの型定義。
 */
export type Breadcrumb = {
  href: string; // リンク先URL
  label: string; // 表示ラベル
};

/**
 * 記事ページに渡されるプロパティの型定義。
 */
export type ArticlePageProps = {
  article: Article; // 記事データ本体
  coverSrc: string | undefined; // カバー画像のURL
  crumbs: Breadcrumb[]; // パンくずリストのアイテム配列
  related: Article[]; // 関連記事の配列
};
