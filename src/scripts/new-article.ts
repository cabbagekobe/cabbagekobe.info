import fs from 'node:fs';
import path from 'node:path';
import prompts from 'prompts';

const ARTICLES_DIR = 'src/content/articles';

type ArticleResponse = {
  title: string;
};

/**
 * 今日の日付を2つの形式で返します。
 * @returns `datePrefix` (YYYYMMDD) と `formattedDate` (YYYY-MM-DD)。
 */
const formatDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return {
    datePrefix: `${year}${month}${day}`,
    formattedDate: `${year}-${month}-${day}`,
  };
};

/**
 * slug から既定のタイトルを生成します。
 * @param slug slug 文字列（例: "my-new-post"）。
 * @returns 単語の先頭を大文字にしたタイトル（例: "My New Post"）。
 */
const titleFromSlug = (slug: string): string => {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * 記事ディレクトリと画像用サブディレクトリを作成します。
 * @param articleDir 記事ディレクトリのパス。
 */
const createArticleDirectoryStructure = (articleDir: string) => {
  const imagesDir = path.join(articleDir, 'images');

  if (fs.existsSync(articleDir)) {
    console.error(`\nError: Directory "${articleDir}" already exists.`);
    process.exit(1);
  }

  console.log(`\nCreating article directory: ${articleDir}`);
  fs.mkdirSync(articleDir, { recursive: true });
  console.log(`Creating images directory: ${imagesDir}`);
  fs.mkdirSync(imagesDir);
  // 空の images ディレクトリを git で追跡するためのファイル
  fs.writeFileSync(path.join(imagesDir, '.gitkeep'), '');
};

/**
 * 新規記事の本文（frontmatter を含む）を生成します。
 * frontmatter の項目は content.config.ts の articles スキーマに合わせること
 * （スキーマにない項目はビルドエラーになる）。
 * @param response プロンプトへの回答。
 * @param formattedDate 日付 (YYYY-MM-DD)。
 * @returns 記事ファイルの内容。
 */
const generateArticle = (
  response: ArticleResponse,
  formattedDate: string,
): string => {
  return `---
title: ${JSON.stringify(response.title)}
# summary: 一覧・記事冒頭・meta description に使う要約（任意）
published_at: ${formattedDate}
updated_at: ${formattedDate}
---

## Section Title

Content here...
`;
};

const main = async () => {
  console.log('📝 Creating a new article...');

  const response = await prompts([
    {
      type: 'text',
      name: 'slug',
      message: 'Article slug (e.g., my-awesome-post)',
      validate: (value: string) =>
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
          ? true
          : 'Slug must be lowercase alphanumeric with hyphens.',
    },
    {
      type: 'text',
      name: 'title',
      message: 'Article title',
      initial: (prev: string) => titleFromSlug(prev),
    },
  ]);

  // キャンセルされた場合は何も作らずに終了する
  if (!response.slug || !response.title) {
    console.log('\nOperation cancelled. No files were created.');
    process.exit(0);
  }

  const { datePrefix, formattedDate } = formatDate();
  const dirName = `${datePrefix}-${response.slug}`;

  const articleDir = path.join(ARTICLES_DIR, dirName);
  createArticleDirectoryStructure(articleDir);

  const filePath = path.join(articleDir, 'index.mdx');
  console.log(`Creating article file: ${filePath}`);
  fs.writeFileSync(filePath, generateArticle(response, formattedDate));

  console.log('\nArticle created successfully! ✨');
  console.log(`You can start editing at: ${filePath}`);
};

main().catch((err) => {
  console.error('\nAn unexpected error occurred:', err);
  process.exit(1);
});
