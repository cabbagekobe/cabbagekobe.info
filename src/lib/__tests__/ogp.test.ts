import { existsSync, readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { OgpCache } from '../ogp';
import { extractOgpUrls } from '../ogp';

vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}));

const mockCache: OgpCache = {
  'https://example.com': {
    title: 'Example Domain',
    description:
      'This domain is for use in illustrative examples in documents.',
    image: 'https://www.iana.org/_img/2022/iana_logo_white.svg',
    url: 'https://example.com',
  },
};

describe('extractOgpUrls', () => {
  it('OGPCard の url 属性を出現順に抽出する', () => {
    const content = `
<OGPCard url="https://example.com/a" />

本文

<OGPCard url="https://example.com/b" />
`;
    expect(extractOgpUrls(content)).toEqual([
      'https://example.com/a',
      'https://example.com/b',
    ]);
  });

  it('シングルクォート・他の属性・改行・閉じタグ前の空白なしを許容する', () => {
    const content = `
<OGPCard url='https://example.com/single' />
<OGPCard class="wide" url="https://example.com/attr"/>
<OGPCard
  url="https://example.com/multiline"
/>
`;
    expect(extractOgpUrls(content)).toEqual([
      'https://example.com/single',
      'https://example.com/attr',
      'https://example.com/multiline',
    ]);
  });

  it('OGPCard がない場合は空配列を返す', () => {
    expect(extractOgpUrls('<a href="https://example.com">link</a>')).toEqual(
      [],
    );
  });
});

describe('getOgp', () => {
  beforeEach(() => {
    // モジュール内に保持したキャッシュをテストごとに破棄する
    vi.resetModules();
    vi.mocked(existsSync).mockReset();
    vi.mocked(readFileSync).mockReset();
  });

  it('キャッシュファイルが有効なJSONの場合、URLに対応するデータを返す', async () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify(mockCache));
    const { getOgp } = await import('../ogp');

    expect(getOgp('https://example.com')).toEqual(
      mockCache['https://example.com'],
    );
    expect(getOgp('https://non-existent-url.com')).toBeNull();
  });

  it('キャッシュファイルは初回の呼び出しで一度だけ読み込む', async () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify(mockCache));
    const { getOgp } = await import('../ogp');

    expect(readFileSync).not.toHaveBeenCalled();
    getOgp('https://example.com');
    getOgp('https://example.com');
    expect(readFileSync).toHaveBeenCalledTimes(1);
  });

  it('キャッシュファイルが存在しない場合、nullを返す', async () => {
    vi.mocked(existsSync).mockReturnValue(false);
    const { getOgp } = await import('../ogp');

    expect(getOgp('https://example.com')).toBeNull();
  });

  it('キャッシュファイルが不正なJSONの場合、エラーを出力してnullを返す', async () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue('invalid json');
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const { getOgp } = await import('../ogp');

    expect(getOgp('https://example.com')).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
