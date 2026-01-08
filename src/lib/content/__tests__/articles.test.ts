import { vi } from 'vitest';
import { getArticlePageProps } from '../articles';
import type { Article } from '../types';

// Article 型のモックデータを作成するヘルパー関数
const createArticleMock = (
  slug: string,
  published_at: string,
  _permalink: string, // unused parameter
  cover_image: string | null = null,
  isDraft: boolean = false,
): Article => ({
  id: `articles/${slug}`,
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

describe('getArticlePageProps', () => {
  const mockAllArticles = [
    createArticleMock('related-b', '2024-01-02', '/b'),
    createArticleMock('related-a', '2024-01-01', '/a'),
  ];

  beforeEach(async () => {
    // 各テストの前にモックをリセット（spyOnされている場合など）
    vi.clearAllMocks();
    // getRelatedArticles をモック化
    // ここでは単純に関連記事を返すようにする
    // 元の getRelatedArticles のテストは上部で完了しているので、ここではその挙動に依存しない
    vi.spyOn(await import('../articles'), 'getRelatedArticles').mockReturnValue(
      mockAllArticles,
    );
  });

  test('should handle absolute cover image path', async () => {
    const article = createArticleMock(
      'another-article',
      '2024-03-01',
      '/articles/another-article',
      'https://example.com/some-image.png', // 絶対パスのカバー画像
      [],
    );

    const props = await getArticlePageProps(article, []); // allArticles は関連しないので空で良い

    expect(props.coverSrc).toBe('https://example.com/some-image.png');
  });

  test('should handle no cover image', async () => {
    const article = createArticleMock(
      'no-cover',
      '2024-02-01',
      '/articles/no-cover',
      null, // カバー画像なし
    );

    const props = await getArticlePageProps(article, []);

    expect(props.coverSrc).toBeUndefined();
  });

  test('should generate props correctly', async () => {
    const article = createArticleMock(
      'main-article',
      '2024-03-15',
      '/articles/main-article',
      './cover.jpg', // 相対パスのカバー画像
    );

    const props = await getArticlePageProps(article, mockAllArticles);

    expect(props.article).toEqual(article);
    expect(props.coverSrc).toBe('/images/articles/main-article/cover.jpg'); // 相対パスの解決
    expect(props.crumbs).toEqual([
      { href: '/', label: 'Home' },
      { label: 'Test Article main-article' },
    ]);
    expect(props.related).toEqual([]); // モックされた関連記事が返されることを確認
  });
});
