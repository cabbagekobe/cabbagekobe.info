import fs from 'node:fs';
import path from 'node:path';

/**
 * Astro 6のentry.idからslugを抽出します。
 * - `articles/YYYYMMD-slug/index.mdx` → `YYYYMMD-slug`
 * - `articles/YYYYMMD-slug/index.md` → `YYYYMMD-slug`
 * - `articles/YYYYMMD-slug.mdx` → `YYYYMMD-slug`
 * - `articles/YYYYMMD-slug.md` → `YYYYMMD-slug`
 * - `YYYYMMD-slug/index.mdx` → `YYYYMMD-slug`
 * - `YYYYMMD-slug/index.md` → `YYYYMMD-slug`
 * - `YYYYMMD-slug.mdx` → `YYYYMMD-slug`
 * - `YYYYMMD-slug.md` → `YYYYMMD-slug`
 * @param id コンテンツエントリのID
 * @returns slug文字列
 */
export function getEntrySlug(id: string): string {
  // コレクションプレフィックスを削除（例: 'articles/slug' -> 'slug'）
  if (id.includes('/')) {
    const parts = id.split('/');
    // 最初の部分がコレクション名だと仮定して削除
    parts.shift();
    id = parts.join('/');
  }

  if (id.endsWith('/index.mdx')) {
    return id.replace('/index.mdx', '');
  }
  if (id.endsWith('/index.md')) {
    return id.replace('/index.md', '');
  }
  return id.replace(/\.mdx?$/, '');
}

/**
 * ソースファイルがデスティネーションファイルよりも新しい場合、
 * またはデスティネーションファイルが存在しない場合に、ファイルをコピーします。
 * コピー先のディレクトリが存在しない場合は作成されます。
 * @param srcPath コピー元のファイルパス。
 * @param destPath コピー先のファイルパス。
 */
export function copyFileIfModified(srcPath: string, destPath: string): void {
  if (!fs.existsSync(srcPath)) {
    return;
  }

  const destDir = path.dirname(destPath);
  fs.mkdirSync(destDir, { recursive: true }); // コピー先ディレクトリを作成

  // コピーが必要かどうかを判定（デスティネーションファイルがない、またはソースの方が新しい場合）
  const needsCopy =
    !fs.existsSync(destPath) ||
    fs.statSync(srcPath).mtimeMs > fs.statSync(destPath).mtimeMs;
  if (needsCopy) {
    fs.copyFileSync(srcPath, destPath); // ファイルをコピー
  }
}

/**
 * 日付文字列またはDateオブジェクトを'ja-JP'ロケール形式にフォーマットします。
 * @param date フォーマットする日付。文字列またはDateオブジェクト、undefined、nullを受け付けます。
 * @returns フォーマットされた日付文字列、または日付が無効な場合は空文字列。
 */
export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return ''; // 日付が提供されない場合は空文字列を返す
  try {
    const d = new Date(date);
    // 'ja-JP'ロケールで'numeric'オプションを使用すると'yyyy/MM/dd'形式になります。
    return d.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch (e) {
    console.error(`Invalid date provided to formatDate: ${date}`, e);
    return ''; // 無効な日付の場合は空文字列を返す
  }
}

/**
 * カバー画像のパスを解決します。
 * @param coverImage 記事のフロントマターから取得したカバー画像情報。文字列、または { src: string } オブジェクト、または undefined。
 * @param articleSlug 記事のスラッグ（画像がローカルファイルの場合に使用）
 * @returns 解決された画像のパス、またはカバー画像がない場合はundefined
 */
export function resolveCoverImagePath(
  coverImage: string | { src: string } | undefined,
  articleSlug: string,
): string | undefined {
  if (!coverImage) return undefined;

  let src: string;
  if (typeof coverImage === 'string') {
    src = coverImage;
  } else if (
    typeof coverImage === 'object' &&
    coverImage !== null &&
    'src' in coverImage &&
    typeof coverImage.src === 'string'
  ) {
    src = coverImage.src;
  } else {
    // 文字列でもオブジェクト（srcプロパティを持つ文字列）でもない場合はundefinedを返す
    return undefined;
  }

  // コンテンツ内の画像パスの場合は、パブリックパスに変換
  if (src.startsWith('/src/content/articles/')) {
    return src.replace('/src/content', '');
  }

  // 相対パスの場合は、記事の画像ディレクトリを基準に変換
  if (src.startsWith('./')) {
    return `/images/articles/${articleSlug}/${src.replace('./', '')}`;
  }

  // それ以外はそのまま返す（絶対パスや外部URLなど）
  return src;
}
