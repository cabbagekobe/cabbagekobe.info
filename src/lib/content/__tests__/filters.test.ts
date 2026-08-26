import { describe, expect, it } from 'vitest';
import { isArticleVisible } from '../filters';

describe('isArticleVisible', () => {
  const pastDate = new Date('2020-01-01');
  const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

  it('公開日が過去で下書きでない記事は表示可能', () => {
    expect(isArticleVisible({ draft: false, published_at: pastDate })).toBe(
      true,
    );
  });

  it('下書き記事は表示不可', () => {
    expect(isArticleVisible({ draft: true, published_at: pastDate })).toBe(
      false,
    );
  });

  it('公開日が未来の記事は表示不可', () => {
    expect(isArticleVisible({ draft: false, published_at: futureDate })).toBe(
      false,
    );
  });

  it('プレビューモードでは下書きも未来日付も表示可能', () => {
    expect(
      isArticleVisible({ draft: true, published_at: futureDate }, true),
    ).toBe(true);
  });

  it('draft が未指定なら下書き扱いしない', () => {
    expect(isArticleVisible({ published_at: pastDate })).toBe(true);
  });
});
