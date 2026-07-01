import { describe, expect, it } from 'vitest';
import { HOME_LABEL } from '@/lib/constants';
import type { Article } from '@/lib/content/types';
import { siteConfig } from '@/site.config';
import type { SiteConfig } from '../../site.config';
import {
  createArticleSchema,
  createBreadcrumbSchema,
  createWebSiteSchema,
} from '../schema';

// Article 型のモックデータを作成するヘルパー関数
const createMockArticle = (overrides: Partial<Article> = {}): Article => {
  const defaultArticle: Article = {
    id: '20240101-test-article/index.mdx',
    slug: '20240101-test-article',
    collection: 'articles',
    body: '## Test',
    render: async () => ({
      Content: () => '<div>Test</div>',
      headings: [],
    }),
    filepath: 'src/content/articles/20240101-test-article/index.mdx',
    permalink: '/articles/20240101-test-article',
    data: {
      title: 'Test Article',
      summary: 'This is a test article.',
      cover_image: undefined,
      published_at: new Date('2024-01-01'),
      updated_at: new Date('2024-01-01'),
    },
    html: '<div>Test</div>',
    markdown: '## Test',
    raw: '',
    resolvedAuthors: [],
    headings: [],
  };
  return { ...defaultArticle, ...overrides };
};

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
    const crumbs = [{ label: HOME_LABEL, href: '/' }, { label: 'Article' }];

    const expectedSchema = {
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
    };

    expect(createBreadcrumbSchema(crumbs, siteUrl)).toEqual(expectedSchema);
  });
});

describe('createArticleSchema', () => {
  const siteUrl = 'https://test.com';

  it('カバー画像がない記事に対して、正しいスキーマを生成する', () => {
    const article = createMockArticle({
      data: {
        title: 'Test Article',
        summary: 'This is a test article.',
        cover_image: undefined,
        published_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-02'),
      },
    });

    const schema = createArticleSchema(article, siteUrl, siteConfig);

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
        name: 'cabbagekobe.info',
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

  it('文字列のカバー画像を持つ記事に対して、画像パスを解決する', () => {
    const article = createMockArticle({
      data: {
        title: 'Test Article with Image',
        summary: 'This article has an image.',
        cover_image: '/src/content/articles/20240101-test-article/image.jpg',
        published_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
      },
    });

    const schema = createArticleSchema(article, siteUrl, siteConfig);

    expect(schema.image).toBe('/articles/20240101-test-article/image.jpg');
  });

  it('オブジェクト形式のカバー画像を持つ記事に対して、画像パスを解決する', () => {
    const article = createMockArticle({
      data: {
        title: 'Test Article with Image Object',
        summary: 'This article has an image object.',
        cover_image: {
          src: '/src/content/articles/20240101-test-article/image.jpg',
        },
        published_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
      },
    });

    const schema = createArticleSchema(article, siteUrl, siteConfig);

    expect(schema.image).toBe('/articles/20240101-test-article/image.jpg');
  });

  it('相対パスのカバー画像を持つ記事に対して、画像パスを解決する', () => {
    const article = createMockArticle({
      data: {
        title: 'Test Article with Relative Image',
        summary: 'This article has a relative image.',
        cover_image: './image.jpg',
        published_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
      },
    });

    const schema = createArticleSchema(article, siteUrl, siteConfig);

    expect(schema.image).toBe(
      '/images/articles/20240101-test-article/image.jpg',
    );
  });
});
