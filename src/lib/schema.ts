import type { Crumb } from '@/components/Breadcrumb.astro';
import type { Article } from '@/lib/content/types';
import { getEntrySlug, resolveCoverImagePath } from '@/lib/content/utils';
import type { SiteConfig } from '@/site.config';

export const createWebSiteSchema = (config: SiteConfig) => {
  return {
    '@type': 'WebSite',
    '@id': `${config.siteUrl}/#website`,
    name: config.title,
    url: config.siteUrl,
    description: config.description,
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
 * @param siteUrl サイトURL
 * @returns Articleスキーマオブジェクト
 */
export const createArticleSchema = (
  article: Article,
  siteUrl: string,
  config: SiteConfig,
) => {
  const { title, summary, cover_image, published_at, updated_at } =
    article.data;
  const coverSrc = cover_image
    ? resolveCoverImagePath(cover_image, getEntrySlug(article.id))
    : undefined;
  const articleUrl = new URL(article.permalink, siteUrl).href;

  return {
    '@type': 'Article',
    '@id': articleUrl,
    headline: title,
    description: summary,
    image: coverSrc,
    datePublished: published_at.toISOString(),
    dateModified: (updated_at ?? published_at).toISOString(),
    publisher: {
      '@type': 'Organization',
      name: config.title,
      logo: {
        '@type': 'ImageObject',
        url: new URL('/favicon.ico', siteUrl).href,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  };
};
