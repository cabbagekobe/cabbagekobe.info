import type { Article } from '../types';

// Article 型のモックデータを作成するヘルパー関数
const createArticleMock = (
  slug: string,
  published_at: string,
  permalink: string,
): Article => ({
  id: `${slug}/index.mdx`,
  collection: 'articles',
  body: '## Test Content',
  permalink,
  data: {
    title: `Test Article ${slug}`,
    published_at: new Date(published_at),
    updated_at: new Date(published_at),
    summary: `Summary of Test Article ${slug}`,
    draft: false,
    show_toc: false,
  },
});

describe('getRelatedArticles', async () => {
  const { getRelatedArticles } = await import('../articles');

  const articles = [
    createArticleMock('a', '2024-01-01', '/a'),
    createArticleMock('b', '2024-01-05', '/b'),
    createArticleMock('c', '2024-01-10', '/c'),
    createArticleMock('d', '2024-01-20', '/d'),
  ];

  test('should return articles sorted by date proximity', () => {
    const target = articles[1]; // b: 2024-01-05
    const related = getRelatedArticles(target, articles, 3);

    expect(related.map((a) => a.id)).toEqual([
      'a/index.mdx', // 4 days away
      'c/index.mdx', // 5 days away
      'd/index.mdx', // 15 days away
    ]);
  });

  test('should exclude the target article', () => {
    const target = articles[0];
    const related = getRelatedArticles(target, articles);
    expect(related.find((a) => a.id === target.id)).toBeUndefined();
  });

  test('should respect max parameter', () => {
    const target = articles[0];
    const related = getRelatedArticles(target, articles, 2);
    expect(related).toHaveLength(2);
  });

  test('should handle empty input', () => {
    const target = articles[0];
    const related = getRelatedArticles(target, [], 5);
    expect(related).toHaveLength(0);
  });

  test('should handle single article (only target)', () => {
    const target = articles[0];
    const related = getRelatedArticles(target, [target], 5);
    expect(related).toHaveLength(0);
  });
});
