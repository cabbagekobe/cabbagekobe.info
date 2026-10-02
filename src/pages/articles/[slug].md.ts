import { readFile } from 'node:fs/promises';
import { getArticlesToBuild } from '@/lib/content/articles';

export async function getStaticPaths() {
  // HTML ページと同じ対象（本番では下書き・未来日付の記事を除外）を配信する
  const articles = await getArticlesToBuild();

  return articles.map((article) => ({
    params: { slug: article.id },
    props: { filePath: article.filePath },
  }));
}

export async function GET({
  props,
}: {
  props: { filePath?: string };
}): Promise<Response> {
  if (!props.filePath) {
    throw new Error('記事のファイルパスを取得できませんでした。');
  }
  const content = await readFile(props.filePath, 'utf-8');

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}
