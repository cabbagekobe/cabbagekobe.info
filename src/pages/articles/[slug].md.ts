import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  filterVisibleArticleFiles,
  loadArticleFiles,
} from '@/lib/content/files';

export async function getStaticPaths() {
  const files = await loadArticleFiles();

  // 本番ビルドでは HTML ページと同様に下書き・未来日付の記事を除外する
  const visibleFiles = filterVisibleArticleFiles(files, !import.meta.env.PROD);

  return visibleFiles.map(({ slug, filepath }) => ({
    params: { slug },
    props: { filepath },
  }));
}

export async function GET({
  props,
}: {
  props: { filepath: string };
}): Promise<Response> {
  const absolutePath = path.resolve(process.cwd(), props.filepath);
  const content = await readFile(absolutePath, 'utf-8');

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}
