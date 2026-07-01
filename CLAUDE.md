# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language

- All responses, comments, JSDoc, and test descriptions should be in Japanese
- This is a Japanese-language blog site

## Build/Lint/Test Commands

```bash
npm run dev              # Dev server (localhost:4321) with OGP prebuild
npm run build            # Production build
npm run preview          # Preview production build
npm run clean            # Remove dist and .astro
npm run check-all        # Full CI check: build + lint + test

# Testing (Vitest)
npm run test                       # Run all tests once
npx vitest run <pattern>           # Run tests matching pattern
npx vitest run src/lib/content     # Run tests in specific directory

# Linting/Formatting (Biome)
npm run lint             # Lint and auto-fix
npm run format           # Format code

# Content
npm run new:article      # Interactive CLI to scaffold new article
```

## Verification

After making changes, run:
```bash
npm run check-all
```

## Architecture

Astro 7 static site with TypeScript, Tailwind CSS 4, and MDX. Deployed to GitHub Pages via GitHub Actions on push to main.

### Content Flow

1. Articles live in `src/content/articles/YYYYMMDD-slug/index.mdx` with frontmatter validated by Zod schema in `src/content.config.ts`
2. `getCollection('articles')` fetches entries, `transformEntryToArticle()` converts to `Article` type with slug/permalink
3. `isArticleVisible()` filters out drafts and future-dated articles
4. Pages in `src/pages/` use `getStaticPaths()` for static generation
5. OGP data is fetched at prebuild time (`src/scripts/fetch-ogp.mjs`) and cached in `.astro/ogp-cache.json`

### Key Modules

- `src/site.config.ts` - Centralized site configuration (title, URL, pagination, OGP defaults)
- `src/lib/content/` - Content processing: transform, filter, related articles, schema generation, utilities
- `src/lib/constants.ts` - Shared constants (e.g., `HOME_LABEL`)
- `src/layouts/Base.astro` - Master layout with SEO, OGP meta, structured data (JSON-LD), dark mode
- `src/components/articles/OGPCard.astro` - Custom MDX component for embedding OGP previews (registered in astro.config.mjs)

### Astro 7 Specifics

- レガシーコンテンツコレクションを利用中（`astro.config.mjs` の `legacy.collectionsBackwardsCompat: true`）。`content.config.ts` は `type: 'content'`、entry ID はパスベース
- Use `getCollection('articles')` (not deprecated `getEntry()`)
- Use `entry.id` (not `entry.slug`)
- Use `render(entry)` function (not `entry.render()` method)
- Use `getEntrySlug(id)` from `@/lib/content/utils` to extract slugs from entry IDs

## Code Style

- **Formatter/Linter**: Biome (2-space indent, single quotes, semicolons)
- **Imports**: Use `@/` path alias for `src/` imports; use `import type` for type-only imports
- **Naming**: camelCase (functions/variables), PascalCase (types, Astro components), UPPER_SNAKE_CASE (constants), kebab-case (utility files)
- **TypeScript**: Explicit return types on exported functions; prefer `type` over `interface`
- **Tests**: Co-located in `__tests__/` directories; use `describe`/`it` with Japanese descriptions
- **Styling**: Tailwind custom theme tokens (`bg-background`, `text-text-body`), fluid typography (`text-scale-0` to `text-scale-4`), dark mode via `dark:` prefix
