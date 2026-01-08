import rss from '@astrojs/rss';
import type { MarkdownInstance } from 'astro';
import { isArticleVisible } from '@/lib/content/filters';
import type { Frontmatter } from '@/lib/content/types';
import { siteConfig } from '@/site.config';

export async function GET(context) {
  const mdxModules = import.meta.glob<MarkdownInstance<Frontmatter>>(
    '/src/content/articles/**/*.mdx',
  );

  const allMdxArticles = await Promise.all(
    Object.keys(mdxModules).map(async (filepath) => {
      const { frontmatter } = await mdxModules[filepath]();
      const slug = filepath.split('/').at(-2) as string;
      return { frontmatter, slug };
    }),
  );

  const publishedArticles = allMdxArticles
    .filter(({ frontmatter }) => isArticleVisible(frontmatter))
    .sort(
      (a, b) =>
        new Date(b.frontmatter.published_at ?? '1900-01-01').valueOf() -
        new Date(a.frontmatter.published_at ?? '1900-01-01').valueOf(),
    );

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site || siteConfig.siteUrl,
    items: publishedArticles.map((article) => ({
      link: `/articles/${article.slug}`,
      title: article.frontmatter.title,
      pubDate: article.frontmatter.published_at,
      description: article.frontmatter.summary,
    })),
    customData: `<language>ja-jp</language>`,
  });
}
