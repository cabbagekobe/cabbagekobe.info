import type { MarkdownHeading } from 'astro';

/**
 * 目次の最上位の項目。配下の h3 を children に持ちます。
 */
export type TocItem = MarkdownHeading & {
  children: MarkdownHeading[];
};

/**
 * 見出しの一覧から、h2 の下に h3 をぶら下げた目次の木を構築します。
 * h2・h3 以外の見出しは含めません。h2 より前に現れた h3 は最上位の項目として扱います。
 * @param headings 記事の見出しの配列（出現順）。
 * @returns 目次の最上位の項目の配列。
 */
export function buildTocTree(headings: MarkdownHeading[]): TocItem[] {
  const tree: TocItem[] = [];

  for (const heading of headings) {
    const parent = tree.at(-1);
    if (heading.depth === 3 && parent?.depth === 2) {
      parent.children.push(heading);
    } else if (heading.depth === 2 || heading.depth === 3) {
      tree.push({ ...heading, children: [] });
    }
  }

  return tree;
}
