import rss from '@astrojs/rss';
import { getAllPublishedArticles } from '@/lib/content/articles';
import { siteConfig } from '@/site.config';

export async function GET(context) {
  const articles = await getAllPublishedArticles();

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site || siteConfig.siteUrl,
    items: articles.map((article) => ({
      link: article.permalink,
      title: article.data.title,
      pubDate: article.data.published_at,
      description: article.data.summary,
    })),
    customData: '<language>ja-jp</language>',
  });
}
