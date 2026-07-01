import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import compress from '@playform/compress';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  alias: { '@': './src' },
  publicDir: './src/public',
  output: 'static',
  outDir: './dist',
  site: 'https://cabbagekobe.info',
  build: {
    inlineStylesheets: 'auto',
  },
  legacy: {
    collectionsBackwardsCompat: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap(),
    compress(),
    mdx({
      components: {
        OGPCard: './src/components/articles/OGPCard.astro',
      },
    }),
  ],
});
