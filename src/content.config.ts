import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// `_` 始まりのファイル・ディレクトリを除外する（レガシーコレクションと同じ挙動）
const contentPattern = [
  '**/*.{md,mdx}',
  '!**/_*/**/*.{md,mdx}',
  '!**/_*.{md,mdx}',
];

const pagesCollection = defineCollection({
  loader: glob({ pattern: contentPattern, base: './src/content/pages' }),
  schema: z.strictObject({
    title: z.string(),
    summary: z.string(),
    published_at: z.date().optional(),
    updated_at: z.date().optional(),
  }),
});

const articlesCollection = defineCollection({
  loader: glob({
    pattern: contentPattern,
    base: './src/content/articles',
  }),
  // 未知のキーはエラーにする（項目名の打ち間違いで下書きが公開されるのを防ぐ）
  schema: ({ image }) =>
    z.strictObject({
      title: z.string(),
      published_at: z.date(),
      updated_at: z.date().optional(),
      summary: z.string().optional(),
      meta_title: z.string().optional(),
      meta_description: z.string().optional(),
      draft: z.boolean().default(false),
      cover_image: image().optional(),
      cover_caption: z.string().optional(),
      show_toc: z.boolean().default(false),
    }),
});

export const collections = {
  pages: pagesCollection,
  articles: articlesCollection,
};
