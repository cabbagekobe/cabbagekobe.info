import { getRelatedArticles } from '../articles';
import type { Article } from '../types';

// Article 型のモックデータを作成するヘルパー関数
const createArticleMock = (
  slug: string,
  published_at: string,
  _permalink: string, // unused parameter
  cover_image: string | null = null,
  isDraft: boolean = false,
): Article => ({
  id: `${slug}/index.mdx`,
  slug: slug,
  collection: 'articles',
  body: '## Test Content',
  render: async () => ({
    Content: () => '<div>Test Content</div>',
    headings: [],
  }),
  filepath: `src/content/articles/${slug}/index.mdx`,
  permalink: _permalink, // _permalink を使用
  data: {
    title: `Test Article ${slug}`,
    published_at: new Date(published_at),
    updated_at: new Date(published_at),
    summary: `Summary of Test Article ${slug}`,
    draft: isDraft,
    cover_image: cover_image,
  },
  html: '<div>Test Content</div>',
  markdown: '## Test Content',
  raw: `---\ntitle: "Test Article ${slug}"\n---\n## Test Content`,
  resolvedAuthors: [],
  headings: [],
});

describe('getRelatedArticles', () => {
  const mockAllArticles = [
    createArticleMock('older-article', '2024-01-01', '/older'),
    createArticleMock('target-article', '2024-06-15', '/target'),
    createArticleMock('newer-article', '2024-12-01', '/newer'),
    createArticleMock('much-older-article', '2023-06-01', '/much-older'),
    createArticleMock('much-newer-article', '2025-06-01', '/much-newer'),
  ];

  test('should exclude target article', () => {
    const target = mockAllArticles[1]; // target-article
    const result = getRelatedArticles(target, mockAllArticles, 10);

    // Target article should not be in the result
    expect(result.some((article) => article.id === target.id)).toBe(false);
    // Should have 4 articles (all except target)
    expect(result.length).toBe(4);
  });

  test('should return articles sorted by date proximity', () => {
    const target = mockAllArticles[1]; // target-article (2024-06-15)
    const result = getRelatedArticles(target, mockAllArticles, 10);

    // Should be ordered by proximity: older-article (~5.5 months diff), newer-article (~5.5 months diff),
    // much-newer-article (~12 months diff), much-older-article (~12.5 months diff)
    // Note: older-article (2024-01-01) is actually slightly closer to target (2024-06-15)
    // than newer-article (2024-12-01) by about 3 days
    expect(result[0].id).toBe('older-article/index.mdx');
    expect(result[1].id).toBe('newer-article/index.mdx');
    expect(result[2].id).toBe('much-newer-article/index.mdx');
    expect(result[3].id).toBe('much-older-article/index.mdx');
  });

  test('should respect max limit', () => {
    const target = mockAllArticles[1]; // target-article
    const result = getRelatedArticles(target, mockAllArticles, 2);

    // Should only return 2 articles despite having 4 available
    expect(result.length).toBe(2);
    // Should be the two closest by date
    // Note: older-article (2024-01-01) is actually slightly closer to target (2024-06-15)
    // than newer-article (2024-12-01) by about 3 days
    expect(result[0].id).toBe('older-article/index.mdx');
    expect(result[1].id).toBe('newer-article/index.mdx');
  });

  test('should handle empty input', () => {
    const target = mockAllArticles[1]; // target-article
    const result = getRelatedArticles(target, [], 5);

    expect(result.length).toBe(0);
  });

  test('should handle single article (only target)', () => {
    const target = mockAllArticles[1]; // target-article
    const result = getRelatedArticles(target, [target], 5);

    expect(result.length).toBe(0);
  });
});
