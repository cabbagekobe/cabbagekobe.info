import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import compress from '@playform/compress';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { siteConfig } from './src/site.config.ts';

export default defineConfig({
  publicDir: './src/public',
  output: 'static',
  outDir: './dist',
  site: siteConfig.siteUrl,
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap(), compress(), mdx()],
});
