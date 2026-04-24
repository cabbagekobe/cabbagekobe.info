import type { Crumb } from '@/components/Breadcrumb.astro';
import type { Article } from '@/lib/content/types';
import { getEntrySlug, resolveCoverImagePath } from '@/lib/content/utils';
import { siteConfig } from '@/site.config';

/**
 * Articleスキーマを生成
 * @param article 記事データ
 * @param siteUrl サイトURL
 * @returns Articleスキーマオブジェクト
 */
export const generateArticleSchema = (article: Article, siteUrl: string) => {
  const { title, summary, cover_image, published_at, updated_at } =
    article.data;
  const coverSrc = cover_image
    ? resolveCoverImagePath(cover_image, getEntrySlug(article.id))
    : undefined;

  return {
    '@type': 'Article',
    '@id': `${siteUrl}/articles/${getEntrySlug(article.id)}/`,
    headline: title,
    description: summary,
    image: coverSrc,
    datePublished: published_at.toISOString(),
    dateModified: (updated_at ?? published_at).toISOString(),
    publisher: {
      '@type': 'Organization',
      name: siteConfig.title,
      logo: {
        '@type': 'ImageObject',
        url: new URL('/favicon.ico', siteUrl).href,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/articles/${getEntrySlug(article.id)}/`,
    },
  };
};

/**
 * パンくずスキーマを生成
 * @param crumbs パンくずリスト
 * @param siteUrl サイトURL
 * @returns BreadcrumbListスキーマオブジェクト
 */
export const generateBreadcrumbSchema = (crumbs: Crumb[], siteUrl: string) => {
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
