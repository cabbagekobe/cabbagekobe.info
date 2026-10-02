import { describe, expect, it } from 'vitest';
import { buildPermalink, formatDate } from '../utils';

describe('buildPermalink', () => {
  it('slug から末尾スラッシュ付きのパーマリンクを生成する', () => {
    expect(buildPermalink('20200501-linux')).toBe('/articles/20200501-linux/');
  });
});

describe('formatDate', () => {
  it('Dateオブジェクトをyyyy/MM/dd形式にフォーマットする', () => {
    expect(formatDate(new Date('2024-01-15T03:00:00.000Z'))).toBe('2024/01/15');
  });

  it('実行環境のタイムゾーンによらず日本時間の日付にする', () => {
    // UTC では 2023/02/09 23:00、日本時間では 2023/02/10 08:00
    expect(formatDate(new Date('2023-02-09T23:00:00.000Z'))).toBe('2023/02/10');
  });
});
