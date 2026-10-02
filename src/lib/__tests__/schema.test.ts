import { describe, expect, it } from 'vitest';
import { HOME_LABEL } from '@/lib/constants';
import type { Article } from '@/lib/content/types';
import type { SiteConfig } from '@/site.config';
import {
  createArticleSchema,
  createBreadcrumbSchema,
  createWebPageSchema,
  createWebSiteSchema,
} from '../schema';

const siteUrl = 'https://test.com';

const config: SiteConfig = {
  title: 'Test Site',
  siteUrl,
  description: 'A test website.',
  articlesPerPage: 10,
  layout: {
    width: 'max-w-5xl',
  },
  ogp: {
    defaultImage: { src: '/images/ogp/default.png', width: 1200, height: 630 },
  },
};

// Article 型のモックデータを作成するヘルパー関数
const createMockArticle = (data: Partial<Article['data']> = {}): Article => ({
  id: '20240101-test-article',
  collection: 'articles',
  body: '## Test',
  permalink: '/articles/20240101-test-article/',
  data: {
    title: 'Test Article',
    summary: 'This is a test article.',
    published_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-02'),
    draft: false,
    show_toc: false,
    ...data,
  },
});

describe('createWebSiteSchema', () => {
  it('正しいSiteConfigを渡すと、期待通りのWebSiteスキーマを生成する', () => {
    expect(createWebSiteSchema(config)).toEqual({
      '@type': 'WebSite',
      '@id': 'https://test.com/#website',
      name: 'Test Site',
      url: 'https://test.com',
      description: 'A test website.',
    });
  });
});

describe('createWebPageSchema', () => {
  it('permalink を絶対URLにしたWebPageスキーマを生成する', () => {
    expect(
      createWebPageSchema(
        {
          title: 'About',
          description: 'About this site.',
          permalink: '/about/',
        },
        siteUrl,
      ),
    ).toEqual({
      '@type': 'WebPage',
      '@id': 'https://test.com/about/',
      name: 'About',
      description: 'About this site.',
      url: 'https://test.com/about/',
    });
  });
});

describe('createBreadcrumbSchema', () => {
  it('空のcrumbs配列を渡すと、nullを返す', () => {
    expect(createBreadcrumbSchema([], siteUrl)).toBeNull();
  });

  it('有効なcrumbs配列を渡すと、期待通りのBreadcrumbListスキーマを生成する', () => {
    const crumbs = [{ label: HOME_LABEL, href: '/' }, { label: 'Article' }];

    expect(createBreadcrumbSchema(crumbs, siteUrl)).toEqual({
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: HOME_LABEL,
          item: 'https://test.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Article',
          item: undefined,
        },
      ],
    });
  });
});

describe('createArticleSchema', () => {
  it('カバー画像がない記事に対して、正しいスキーマを生成する', () => {
    const schema = createArticleSchema(createMockArticle(), config);

    expect(schema).toEqual({
      '@type': 'Article',
      '@id': `${siteUrl}/articles/20240101-test-article/`,
      headline: 'Test Article',
      description: 'This is a test article.',
      image: undefined,
      datePublished: '2024-01-01T00:00:00.000Z',
      dateModified: '2024-01-02T00:00:00.000Z',
      publisher: {
        '@type': 'Organization',
        name: 'Test Site',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/favicon.ico`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${siteUrl}/articles/20240101-test-article/`,
      },
    });
  });

  it('updated_at がない記事では dateModified に公開日を使う', () => {
    const schema = createArticleSchema(
      createMockArticle({ updated_at: undefined }),
      config,
    );

    expect(schema.dateModified).toBe('2024-01-01T00:00:00.000Z');
  });

  it('カバー画像を持つ記事では image を絶対URLにする', () => {
    const schema = createArticleSchema(
      createMockArticle({
        cover_image: {
          src: '/_astro/cover.abc123.jpg',
          width: 1200,
          height: 630,
          format: 'jpg',
        },
      }),
      config,
    );

    expect(schema.image).toBe('https://test.com/_astro/cover.abc123.jpg');
  });
});
