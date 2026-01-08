import type { Crumb } from '@/components/Breadcrumb.astro';
import type { SiteConfig } from '@/site.config';

export const createWebSiteSchema = (siteConfig: SiteConfig) => {
  return {
    '@type': 'WebSite',
    '@id': `${siteConfig.siteUrl}/#website`,
    name: siteConfig.title,
    url: siteConfig.siteUrl,
    description: siteConfig.description,
  };
};

export const createBreadcrumbSchema = (crumbs: Crumb[], siteUrl: string) => {
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
