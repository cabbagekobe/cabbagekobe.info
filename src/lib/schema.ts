import type { Article } from '@/lib/content/types';
import type { SiteConfig } from '@/site.config';

/**
 * パンくずリストの1項目。href がない項目は現在のページを表します。
 */
export type Crumb = {
  href?: string;
  label: string;
};

export const createWebSiteSchema = (config: SiteConfig) => {
  return {
    '@type': 'WebSite',
    '@id': `${config.siteUrl}/#website`,
    name: config.title,
    url: config.siteUrl,
    description: config.description,
  };
};

/**
 * WebPageスキーマを生成
 * @param page ページのタイトル・説明・パーマリンク
 * @param siteUrl サイトURL
 * @returns WebPageスキーマオブジェクト
 */
export const createWebPageSchema = (
  page: { title?: string; description?: string; permalink: string },
  siteUrl: string,
) => {
  const url = new URL(page.permalink, siteUrl).href;
  return {
    '@type': 'WebPage',
    '@id': url,
    name: page.title,
    description: page.description,
    url,
  };
};

export const createBreadcrumbSchema = (
  crumbs: Crumb[] | undefined,
  siteUrl: string,
) => {
  if (!crumbs || crumbs.length === 0) {
    return null;
  }
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: crumb.href ? new URL(crumb.href, siteUrl).href : undefined,
    })),
  };
};

/**
 * Articleスキーマを生成
 * @param article 記事データ
 * @param config サイト設定
 * @returns Articleスキーマオブジェクト
 */
export const createArticleSchema = (article: Article, config: SiteConfig) => {
  const { title, summary, cover_image, published_at, updated_at } =
    article.data;
  const articleUrl = new URL(article.permalink, config.siteUrl).href;

  return {
    '@type': 'Article',
    '@id': articleUrl,
    headline: title,
    description: summary,
    image: cover_image && new URL(cover_image.src, config.siteUrl).href,
    datePublished: published_at.toISOString(),
    dateModified: (updated_at ?? published_at).toISOString(),
    publisher: {
      '@type': 'Organization',
      name: config.title,
      logo: {
        '@type': 'ImageObject',
        url: new URL('/favicon.ico', config.siteUrl).href,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  };
};
