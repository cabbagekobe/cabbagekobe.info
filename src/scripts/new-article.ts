import fs from 'node:fs';
import path from 'node:path';
import prompts from 'prompts';

const ARTICLES_DIR = 'src/content/articles';

// --- Type Definitions ---

// --- Helper Functions ---

/**
 * Generates current date in specified formats.
 * @returns An object containing `datePrefix` (YYYYMMDD) and `formattedDate` (YYYY-MM-DD).
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
 * Generates a default title from a slug.
 * @param slug - The slug string (e.g., "my-new-post").
 * @returns A capitalized title (e.g., "My New Post").
 */
const titleFromSlug = (slug: string): string => {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Creates the article directory and its images subdirectory, adding a .gitkeep file.
 * @param articleDir - The path to the main article directory.
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
  fs.writeFileSync(path.join(imagesDir, '.gitkeep'), ''); // Keep images dir in git
};

interface ArticleResponse {
  title: string;
}

/**
 * Generates the frontmatter string for a new article.
 * @param response - The user's prompt responses.
 * @param formattedDate - The formatted date (YYYY-MM-DD).
 * @returns The frontmatter string.
 */
const generateFrontmatter = (
  response: ArticleResponse,
  formattedDate: string,
): string => {
  return `---
title: "${response.title}"
summary: ""
published_at: ${formattedDate}
updated_at: ${formattedDate}
reading_time_minutes: 2
level: beginner
format: essay
cover_image: ""
---

## Section Title

Content here...
`;
};

// --- Main Logic ---

const main = async () => {
  console.log('📝 Creating a new article...');

  // --- User Prompts ---
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

  // Exit if user cancels
  if (!response.slug || !response.title) {
    console.log('\nOperation cancelled. No files were created.');
    process.exit(0);
  }

  // --- Directory and File Creation ---
  const { datePrefix, formattedDate } = formatDate();
  const dirName = `${datePrefix}-${response.slug}`;

  const articleDir = path.join(ARTICLES_DIR, dirName);
  createArticleDirectoryStructure(articleDir);

  // --- Frontmatter Generation ---
  const frontmatter = generateFrontmatter(response, formattedDate);

  const mdFilePath = path.join(articleDir, 'index.md');
  console.log(`Creating Markdown file: ${mdFilePath}`);
  fs.writeFileSync(mdFilePath, frontmatter.trim());

  console.log('\nArticle created successfully! ✨');
  console.log(`You can start editing at: ${mdFilePath}`);
};

main().catch((err) => {
  console.error('\nAn unexpected error occurred:', err);
  process.exit(1);
});
