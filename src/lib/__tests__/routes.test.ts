import fs from 'node:fs';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { describe, expect, it, vi } from 'vitest';
import { listAllRoutes } from '../routes';

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
vi.mock('../content/taxonomy', () => ({}));

describe('listAllRoutes', () => {
  it('すべてのルートを正しくリストし、ソートして返す', async () => {
    // fast-glob のモック設定
    vi.mocked(fg).mockImplementation((pattern) => {
      if (pattern === 'src/pages/**/*.astro') {
        return Promise.resolve([
          'src/pages/index.astro',
          'src/pages/about.astro',
          'src/pages/contact/index.astro',
        ]);
      }
      if (pattern === 'src/content/articles/**/*.mdx') {
        return Promise.resolve([
          'src/content/articles/20251220-test/index.mdx',
          'src/content/articles/20300101-favoright-test/index.mdx',
        ]);
      }
      return Promise.resolve([]);
    });

    // fs.readFileSync のモック設定
    vi.mocked(fs.readFileSync).mockImplementation((filepath: string) => {
      if (filepath.includes('20251220-test')) {
        return `---
title: Test Article
permalink: /articles/test-article/
---
Content for test article.`;
      }
      if (filepath.includes('20300101-favoright-test')) {
        return `---
title: Favolight Test Article
permalink: /articles/favoright-test-article/
---
Content for favoright test article.`;
      }
      return '';
    });

    // テスト用の型定義
    interface MockGrayMatterFile {
      data: { [key: string]: string };
      content: string;
    }
    // gray-matter のモック設定
    vi.mocked(matter).mockImplementation((raw: string): MockGrayMatterFile => {
      // raw テキストからフロントマターを直接解析するシンプルなロジック
      const frontmatterMatch = raw.match(/---\n([\s\S]*?)\n---/);
      if (frontmatterMatch?.[1]) {
        const frontmatterStr = frontmatterMatch[1];
        const data: { [key: string]: string } = {};
        frontmatterStr.split('\n').forEach((line) => {
          const parts = line.split(':');
          if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join(':').trim();
            // 値が文字列であることを想定し、quote を除去
            data[key] = value.replace(/^['"]|['"]$/g, '');
          }
        });
        return { data, content: '' };
      }
      return { data: {}, content: '' };
    });

    const expectedRoutes = [
      '/',
      '/about/',
      '/articles/',
      '/articles/favoright-test-article/',
      '/articles/test-article/',
      '/contact/',
    ];

    const result = await listAllRoutes();
    expect(result).toEqual(expectedRoutes);
  });
});
