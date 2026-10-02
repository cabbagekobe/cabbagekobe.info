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
  integrations: [
    sitemap(),
    // CSS は Vite が圧縮済み。compress の CSS 圧縮 (csso) は Tailwind 4 が出力する
    // `@media (width >= 48rem)` を解釈できず md: のルールを捨てるため無効にする
    compress({ CSS: false }),
    mdx(),
  ],
});
