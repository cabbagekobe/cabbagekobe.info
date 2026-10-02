import { getCollection } from 'astro:content';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getArticlesToBuild,
  getRelatedArticles,
  sortByPublishedDesc,
} from '../articles';
import type { Article } from '../types';

vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
}));

// Article 型のモックデータを作成するヘルパー関数
const createArticleMock = (
  slug: string,
  published_at: string,
  draft = false,
): Article => ({
  id: slug,
  collection: 'articles',
  body: '## Test Content',
  permalink: `/articles/${slug}/`,
  data: {
    title: `Test Article ${slug}`,
    published_at: new Date(published_at),
    updated_at: new Date(published_at),
    summary: `Summary of Test Article ${slug}`,
    draft,
    show_toc: false,
  },
});

const articles = [
  createArticleMock('a', '2024-01-01'),
  createArticleMock('b', '2024-01-05'),
  createArticleMock('c', '2024-01-10'),
  createArticleMock('d', '2024-01-20'),
];

describe('sortByPublishedDesc', () => {
  it('公開日の新しい順に並べ、元の配列は変更しない', () => {
    const input = [articles[1], articles[3], articles[0], articles[2]];

    expect(sortByPublishedDesc(input).map((a) => a.id)).toEqual([
      'd',
      'c',
      'b',
      'a',
    ]);
    expect(input.map((a) => a.id)).toEqual(['b', 'd', 'a', 'c']);
  });
});

describe('getArticlesToBuild', () => {
  const entries = [
    createArticleMock('published', '2024-01-01'),
    createArticleMock('draft', '2024-01-01', true),
    createArticleMock('future', '2999-01-01'),
  ];

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('本番ビルドでは下書きと未来日付の記事を除外する', async () => {
    vi.stubEnv('PROD', true);
    vi.mocked(getCollection).mockResolvedValue(entries);

    const articles = await getArticlesToBuild();

    expect(articles.map((a) => a.id)).toEqual(['published']);
  });

  it('開発時は下書きと未来日付の記事も含める', async () => {
    vi.stubEnv('PROD', false);
    vi.mocked(getCollection).mockResolvedValue(entries);

    const articles = await getArticlesToBuild();

    expect(articles.map((a) => a.id)).toEqual(['published', 'draft', 'future']);
  });
});

describe('getRelatedArticles', () => {
  it('公開日が近い順に記事を返す', () => {
    const target = articles[1]; // b: 2024-01-05
    const related = getRelatedArticles(target, articles, 3);

    expect(related.map((a) => a.id)).toEqual([
      'a', // 4日差
      'c', // 5日差
      'd', // 15日差
    ]);
  });

  it('対象記事自身は含めない', () => {
    const target = articles[0];
    const related = getRelatedArticles(target, articles);
    expect(related.find((a) => a.id === target.id)).toBeUndefined();
  });

  it('max で指定した件数までに絞る', () => {
    const target = articles[0];
    const related = getRelatedArticles(target, articles, 2);
    expect(related).toHaveLength(2);
  });

  it('記事が空の場合は空配列を返す', () => {
    const target = articles[0];
    const related = getRelatedArticles(target, [], 5);
    expect(related).toHaveLength(0);
  });

  it('対象記事しかない場合は空配列を返す', () => {
    const target = articles[0];
    const related = getRelatedArticles(target, [target], 5);
    expect(related).toHaveLength(0);
  });
});
