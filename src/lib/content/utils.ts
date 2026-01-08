import fs from 'node:fs';
import path from 'node:path';

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
