import fs from 'node:fs';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { describe, expect, it, vi } from 'vitest';
import type { ArticleFile } from '../files';
import { filterVisibleArticleFiles, loadArticleFiles } from '../files';

// モジュール全体をモック
vi.mock('node:fs', () => ({
  default: {
    readFileSync: vi.fn(),
  },
}));
vi.mock('fast-glob', () => ({
  default: vi.fn(),
}));
vi.mock('gray-matter', () => ({
  default: vi.fn(),
}));

describe('loadArticleFiles', () => {
  it('記事ファイルを読み込み、slug・permalink・frontmatter を返す', async () => {
    vi.mocked(fg).mockResolvedValue([
      'src/content/articles/20240101-first/index.mdx',
      'src/content/articles/20240201-second/index.md',
    ]);
    vi.mocked(fs.readFileSync).mockReturnValue('raw');
    vi.mocked(matter).mockImplementation((raw) => {
      void raw;
      return {
        data: { title: 'Test', draft: true },
        content: '',
      } as unknown as ReturnType<typeof matter>;
    });

    const files = await loadArticleFiles();

    expect(files).toEqual([
      {
        filepath: 'src/content/articles/20240101-first/index.mdx',
        slug: '20240101-first',
        permalink: '/articles/20240101-first',
        frontmatter: { title: 'Test', draft: true },
      },
      {
        filepath: 'src/content/articles/20240201-second/index.md',
        slug: '20240201-second',
        permalink: '/articles/20240201-second',
        frontmatter: { title: 'Test', draft: true },
      },
    ]);
  });

  it('frontmatter の permalink 指定を優先する', async () => {
    vi.mocked(fg).mockResolvedValue([
      'src/content/articles/20240101-first/index.mdx',
    ]);
    vi.mocked(fs.readFileSync).mockReturnValue('raw');
    vi.mocked(matter).mockReturnValue({
      data: { title: 'Test', permalink: '/custom-path/' },
      content: '',
    } as unknown as ReturnType<typeof matter>);

    const files = await loadArticleFiles();

    expect(files[0].permalink).toBe('/custom-path/');
  });
});

describe('filterVisibleArticleFiles', () => {
  const makeFile = (slug: string, frontmatter: ArticleFile['frontmatter']) => ({
    filepath: `src/content/articles/${slug}/index.mdx`,
    slug,
    permalink: `/articles/${slug}`,
    frontmatter,
  });

  const published = makeFile('20240101-published', {
    title: 'Published',
    published_at: new Date('2020-01-01'),
  });
  const draft = makeFile('20240102-draft', {
    title: 'Draft',
    published_at: new Date('2020-01-01'),
    draft: true,
  });
  const future = makeFile('20991231-future', {
    title: 'Future',
    published_at: new Date('2099-12-31'),
  });

  it('下書きと未来日付の記事を除外する', () => {
    expect(filterVisibleArticleFiles([published, draft, future])).toEqual([
      published,
    ]);
  });

  it('プレビューモードではすべての記事を含める', () => {
    expect(filterVisibleArticleFiles([published, draft, future], true)).toEqual(
      [published, draft, future],
    );
  });
});
