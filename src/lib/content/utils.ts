import fs from 'node:fs';
import path from 'node:path';

/**
 * Astro 6のentry.idからslugを抽出します。
 * Astro 6 では entry.id にコレクション名は含まれません。
 * - `YYYYMMDD-slug/index.mdx` → `YYYYMMDD-slug`
 * - `YYYYMMDD-slug/index.md` → `YYYYMMDD-slug`
 * - `YYYYMMDD-slug.mdx` → `YYYYMMDD-slug`
 * - `YYYYMMDD-slug.md` → `YYYYMMDD-slug`
 * @param id コンテンツエントリのID
 * @returns slug文字列
 */
export function getEntrySlug(id: string): string {
  // index.mdx / index.md 形式: ディレクトリ名がslug
  if (id.endsWith('/index.mdx') || id.endsWith('/index.md')) {
    const dir = id.replace(/\/index\.mdx?$/, '');
    // ディレクトリ名の最後のセグメントを返す
    const lastSegment = dir.split('/').pop();
    return lastSegment || dir;
  }

  // フラットファイル形式: 拡張子を除いたファイル名がslug
  const basename = id.split('/').pop() || id;
  return basename.replace(/\.mdx?$/, '');
}

/**
 * 記事のパーマリンクを生成します。
 * フロントマターで permalink が指定されていればそれを優先し、
 * なければ slug から既定の `/articles/{slug}` を生成します。
 * @param slug 記事のスラッグ
 * @param override フロントマターで指定されたパーマリンク（任意）
 * @returns パーマリンク文字列
 */
export function buildPermalink(slug: string, override?: string): string {
  return override || `/articles/${slug}`;
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

  const d = new Date(date);
  // new Date は無効な入力でも例外を投げず Invalid Date を返すため、明示的に判定する
  if (Number.isNaN(d.getTime())) {
    console.error(`Invalid date provided to formatDate: ${String(date)}`);
    return ''; // 無効な日付の場合は空文字列を返す
  }

  // 'ja-JP'ロケールで'numeric'オプションを使用すると'yyyy/MM/dd'形式になります。
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
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
