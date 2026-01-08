import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import compress from '@playform/compress';
import { defineConfig } from 'astro/config';
import rehypeSlug from 'rehype-slug';

export default defineConfig({
  alias: { '@': './src' },
  publicDir: './src/public',
  output: 'static',
  outDir: './dist',
  site: 'https://cabbagekobe.info',
  build: {
    inlineStylesheets: 'auto',
  },
  integrations: [
    tailwind({ config: { applyBaseStyles: false } }),
    sitemap(),
    compress(),
    mdx({
      rehypePlugins: [rehypeSlug],
      components: {
        OGPCard: './src/components/articles/OGPCard.astro', // 文字列でパスを指定
      },
    }),
  ],
});
