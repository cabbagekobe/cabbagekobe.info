import { defineCollection, z } from 'astro:content';

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    published_at: z.date().optional(),
    updated_at: z.date().optional(),
  }),
});

const articlesCollection = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      published_at: z.date(),
      summary: z.string().optional(),
      meta_title: z.string().optional(),
      meta_description: z.string().optional(),
      permalink: z.string().optional(),
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
