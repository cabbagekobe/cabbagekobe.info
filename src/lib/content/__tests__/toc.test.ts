import { describe, expect, it } from 'vitest';
import { buildTocTree } from '../toc';

const heading = (depth: number, text: string) => ({
  depth,
  text,
  slug: text.toLowerCase(),
});

describe('buildTocTree', () => {
  it('h3 を直前の h2 の子としてまとめる', () => {
    const tree = buildTocTree([
      heading(2, 'A'),
      heading(3, 'A-1'),
      heading(3, 'A-2'),
      heading(2, 'B'),
      heading(3, 'B-1'),
    ]);

    expect(tree).toEqual([
      {
        ...heading(2, 'A'),
        children: [heading(3, 'A-1'), heading(3, 'A-2')],
      },
      { ...heading(2, 'B'), children: [heading(3, 'B-1')] },
    ]);
  });

  it('h2・h3 以外の見出しは含めない', () => {
    const tree = buildTocTree([
      heading(1, 'Title'),
      heading(2, 'A'),
      heading(4, 'Deep'),
    ]);

    expect(tree).toEqual([{ ...heading(2, 'A'), children: [] }]);
  });

  it('h2 より前に現れた h3 は最上位の項目として扱う', () => {
    const tree = buildTocTree([heading(3, 'Orphan'), heading(2, 'A')]);

    expect(tree).toEqual([
      { ...heading(3, 'Orphan'), children: [] },
      { ...heading(2, 'A'), children: [] },
    ]);
  });

  it('見出しがない場合は空配列を返す', () => {
    expect(buildTocTree([])).toEqual([]);
  });
});
