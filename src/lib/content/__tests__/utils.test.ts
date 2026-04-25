import { describe, expect, it } from 'vitest';
import { formatDate, getEntrySlug, resolveCoverImagePath } from '../utils';

describe('getEntrySlug', () => {
  it('ディレクトリ形式 (slug/index.mdx) からslugを抽出する', () => {
    expect(getEntrySlug('20200501-linux/index.mdx')).toBe('20200501-linux');
  });

  it('ディレクトリ形式 (slug/index.md) からslugを抽出する', () => {
    expect(getEntrySlug('20200501-linux/index.md')).toBe('20200501-linux');
  });

  it('フラットファイル形式 (slug.mdx) からslugを抽出する', () => {
    expect(getEntrySlug('20200501-linux.mdx')).toBe('20200501-linux');
  });

  it('フラットファイル形式 (slug.md) からslugを抽出する', () => {
    expect(getEntrySlug('20200501-linux.md')).toBe('20200501-linux');
  });

  it('拡張子なしのIDをそのまま返す', () => {
    expect(getEntrySlug('20200501-linux')).toBe('20200501-linux');
  });
});

describe('formatDate', () => {
  it('Dateオブジェクトをja-JP形式にフォーマットする', () => {
    const result = formatDate(new Date('2024-01-15'));
    expect(result).toMatch(/2024/);
    expect(result).toMatch(/01/);
    expect(result).toMatch(/15/);
  });

  it('nullの場合は空文字列を返す', () => {
    expect(formatDate(null)).toBe('');
  });

  it('undefinedの場合は空文字列を返す', () => {
    expect(formatDate(undefined)).toBe('');
  });
});

describe('resolveCoverImagePath', () => {
  it('undefinedの場合はundefinedを返す', () => {
    expect(resolveCoverImagePath(undefined, 'test')).toBeUndefined();
  });

  it('/src/content/articles/ パスをパブリックパスに変換する', () => {
    expect(
      resolveCoverImagePath(
        '/src/content/articles/20240101-test/image.jpg',
        '20240101-test',
      ),
    ).toBe('/articles/20240101-test/image.jpg');
  });

  it('相対パスを記事の画像ディレクトリに変換する', () => {
    expect(resolveCoverImagePath('./image.jpg', '20240101-test')).toBe(
      '/images/articles/20240101-test/image.jpg',
    );
  });

  it('絶対URLをそのまま返す', () => {
    expect(resolveCoverImagePath('https://example.com/image.jpg', 'test')).toBe(
      'https://example.com/image.jpg',
    );
  });

  it('オブジェクト形式 ({src: string}) を処理する', () => {
    expect(
      resolveCoverImagePath(
        { src: '/src/content/articles/20240101-test/image.jpg' },
        '20240101-test',
      ),
    ).toBe('/articles/20240101-test/image.jpg');
  });
});
