import { describe, expect, it } from 'vitest';
import type { Crumb } from '@/components/Breadcrumb.astro';
import { createArticleSchema, createBreadcrumbSchema } from '@/lib/schema';
import { siteConfig } from '@/site.config';
import type { Article } from '../types';

// Helper to create a mock Article
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

describe('createArticleSchema', () => {
  const siteUrl = 'https://test.com';

  it('should generate correct schema for article without cover image', () => {
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

  it('should generate correct schema for article with string cover image', () => {
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

  it('should generate correct schema for article with object cover image', () => {
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

  it('should generate correct schema for article with relative cover image', () => {
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
      `/images/articles/20240101-test-article/image.jpg`,
    );
  });
});

describe('createBreadcrumbSchema', () => {
  const siteUrl = 'https://test.com';

  it('should return null for empty crumbs', () => {
    const schema = createBreadcrumbSchema([], siteUrl);
    expect(schema).toBeNull();
  });

  it('should generate correct breadcrumb schema', () => {
    const crumbs: Crumb[] = [
      { label: 'Home', href: '/' },
      { label: 'Articles', href: '/articles' },
      { label: 'Test Article' },
    ];

    const schema = createBreadcrumbSchema(crumbs, siteUrl);

    expect(schema).toEqual({
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
          name: 'Articles',
          item: 'https://test.com/articles',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Test Article',
          item: undefined,
        },
      ],
    });
  });
});
