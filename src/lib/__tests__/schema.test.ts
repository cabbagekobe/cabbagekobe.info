import { describe, expect, it } from 'vitest';
import type { SiteConfig } from '../../site.config';
import { createBreadcrumbSchema, createWebSiteSchema } from '../schema';

describe('createWebSiteSchema', () => {
  it('正しいSiteConfigを渡すと、期待通りのWebSiteスキーマを生成する', () => {
    const siteConfig: SiteConfig = {
      title: 'Test Site',
      siteUrl: 'https://test.com',
      description: 'A test website.',
      articlesPerPage: 10,
      layout: {
        width: 'max-w-5xl',
      },
    };

    const expectedSchema = {
      '@type': 'WebSite',
      '@id': 'https://test.com/#website',
      name: 'Test Site',
      url: 'https://test.com',
      description: 'A test website.',
    };

    expect(createWebSiteSchema(siteConfig)).toEqual(expectedSchema);
  });
});

describe('createBreadcrumbSchema', () => {
  const siteUrl = 'https://test.com';

  it('空のcrumbs配列を渡すと、nullを返す', () => {
    expect(createBreadcrumbSchema([], siteUrl)).toBeNull();
  });

  it('有効なcrumbs配列を渡すと、期待通りのBreadcrumbListスキーマを生成する', () => {
    const crumbs = [{ label: 'Home', href: '/' }, { label: 'Article' }];

    const expectedSchema = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://test.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Article',
          item: undefined,
        },
      ],
    };

    expect(createBreadcrumbSchema(crumbs, siteUrl)).toEqual(expectedSchema);
  });
});
