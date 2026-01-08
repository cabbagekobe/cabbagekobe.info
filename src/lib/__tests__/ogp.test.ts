import fs from 'node:fs';
import path from 'node:path';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { OgpData } from '../ogp';

// テスト用のキャッシュファイルパスを定義
const OGP_CACHE_DIR = path.join(process.cwd(), '.astro');
const OGP_CACHE_PATH = path.join(OGP_CACHE_DIR, 'ogp-cache.json');

// テスト用のモックデータ
const mockOgpData: Record<string, OgpData> = {
  'https://example.com': {
    title: 'Example Domain',
    description:
      'This domain is for use in illustrative examples in documents.',
    image: 'https://www.iana.org/_img/2022/iana_logo_white.svg',
    url: 'https://example.com',
  },
};

// ヘルパー関数: キャッシュファイルをクリーンアップ
const cleanupCache = () => {
  if (fs.existsSync(OGP_CACHE_PATH)) {
    fs.unlinkSync(OGP_CACHE_PATH);
  }
  // .astro ディレクトリが空でなければ他のファイルがある可能性があるので削除しない
};

describe('getOgp with file I/O', () => {
  beforeEach(() => {
    cleanupCache();
    vi.resetModules();
  });

  afterAll(() => {
    cleanupCache();
  });

  it('キャッシュファイルが存在し、有効なJSONの場合、データを正しく読み込む', async () => {
    // テスト用のキャッシュファイルを作成
    fs.mkdirSync(OGP_CACHE_DIR, { recursive: true });
    fs.writeFileSync(OGP_CACHE_PATH, JSON.stringify(mockOgpData));

    // テスト対象モジュールを動的にインポート
    const { getOgp } = await import('../ogp');

    // 検証
    expect(getOgp('https://example.com')).toEqual(
      mockOgpData['https://example.com'],
    );
    expect(getOgp('https://non-existent-url.com')).toBeNull();
  });

  it('キャッシュファイルが存在しない場合、getOgpは常にnullを返す', async () => {
    // テスト対象モジュールを動的にインポート
    const { getOgp } = await import('../ogp');

    // 検証
    expect(getOgp('https://example.com')).toBeNull();
  });

  it('キャッシュファイルが不正なJSONの場合、getOgpは常にnullを返す', async () => {
    // 不正なJSONファイルを作成
    fs.mkdirSync(OGP_CACHE_DIR, { recursive: true });
    fs.writeFileSync(OGP_CACHE_PATH, 'invalid json');

    // console.errorをスパイして、エラー出力をキャプチャ
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // テスト対象モジュールを動的にインポート
    const { getOgp } = await import('../ogp');

    // 検証
    expect(getOgp('https://example.com')).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();

    // スパイを元に戻す
    consoleErrorSpy.mockRestore();
  });
});
