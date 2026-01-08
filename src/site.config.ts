export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  title: 'cabbagekobe.info',
  description: 'cabbagekobe.info',
  siteUrl: 'https://cabbagekobe.info',
  articlesPerPage: 120,
  layout: {
    width: 'max-w-5xl',
  },
  ogp: {
    defaultImage: '/images/ogp/default.svg',
  },
  sns: {
    twitter: '@username',
  },
};
