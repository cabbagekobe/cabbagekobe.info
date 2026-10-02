import { describe, expect, it } from 'vitest';
import { buildPermalink, formatDate } from '../utils';

describe('buildPermalink', () => {
  it('slug から末尾スラッシュ付きのパーマリンクを生成する', () => {
    expect(buildPermalink('20200501-linux')).toBe('/articles/20200501-linux/');
  });
});

describe('formatDate', () => {
  it('Dateオブジェクトをja-JP形式にフォーマットする', () => {
    expect(formatDate(new Date(2024, 0, 15))).toBe('2024/01/15');
  });
});
