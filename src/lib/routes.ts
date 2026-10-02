import fg from 'fast-glob';

/**
 * ビルド済みの `dist/` から、サイト内のすべての HTML ルートを列挙します。
 * 事前に `npm run build` を実行しておく必要があります。
 * @returns ソート済みのルートパスの配列。
 */
export async function listAllRoutes(): Promise<string[]> {
  const htmlFiles = await fg('**/*.html', { cwd: 'dist' });

  return htmlFiles
    .map((file) => encodeURI(`/${file.replace(/index\.html$/, '')}`))
    .sort();
}
