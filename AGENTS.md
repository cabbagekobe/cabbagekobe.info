# AGENTS.md

Guidance for AI agents working with code in this repository. `CLAUDE.md` imports this file, so this is the single source of truth.

## Language

- All responses, comments, JSDoc, and test descriptions should be in Japanese
- This is a Japanese-language blog site

## Build/Lint/Test Commands

```bash
npm run dev              # Dev server (localhost:4321) with OGP prebuild
npm run build            # Production build (runs the OGP prebuild first)
npm run preview          # Preview production build
npm run clean            # Remove dist and .astro
npm run check-all        # Full CI check: build + lint (no auto-fix) + typecheck + test

# Testing (Vitest)
npm run test                       # Run all tests once
npx vitest run <pattern>           # Run tests matching pattern
npx vitest run src/lib/content     # Run tests in specific directory

# Linting/Formatting (Biome)
npm run lint             # Lint and auto-fix
npm run format           # Format code

# Type checking
npm run typecheck        # astro check

# Content
npm run new:article      # Interactive CLI to scaffold new article

# Tools (run `npm run build` first; both read routes from dist/)
npm run list:routes      # List all built routes
npm run screenshot:pages # Screenshot all built routes (requires Playwright)
```

## Verification

After making changes, run:
```bash
npm run check-all
```

`check-all` mirrors CI and does not auto-fix. Run `npm run lint` to fix lint/format errors.

## Architecture

Astro 7 static site with TypeScript, Tailwind CSS 4, and MDX. GitHub Actions runs the checks on pull requests and deploys to GitHub Pages on push to main.

### Content Flow

1. Articles live in `src/content/articles/YYYYMMDD-slug/index.mdx` (`.md` also works, but MDX components need `.mdx`) with frontmatter validated by a strict Zod schema in `src/content.config.ts`. Unknown frontmatter keys fail the build
2. `getCollection('articles')` fetches entries, `transformEntryToArticle()` converts to `Article` type with `permalink` (`/articles/{slug}/`, always with a trailing slash)
3. `isArticleVisible()` filters out drafts and future-dated articles. `getArticlesToBuild()` returns the articles to generate per-article routes for (production: visible only, dev: all)
4. Pages in `src/pages/` use `getStaticPaths()` for static generation. `src/pages/articles/[slug].md.ts` serves the raw Markdown of each article via `entry.filePath`
5. OGP data is fetched at prebuild time (`src/scripts/fetch-ogp.ts`) and cached in `.astro/ogp-cache.json`. URLs that fail to fetch are not cached and are retried on the next run

### Key Modules

- `src/site.config.ts` - Centralized site configuration (title, URL, pagination, OGP defaults). `astro.config.mjs` reads `site` from here
- `src/lib/content/` - Content processing: `articles.ts` (fetch, sort, related articles), `filters.ts`, `transform.ts`, `toc.ts` (table-of-contents tree), `utils.ts`
- `src/lib/schema.ts` - Structured data (JSON-LD) builders and the `Crumb` type
- `src/lib/ogp.ts` - OGP cache reader and `<OGPCard>` URL extraction, shared with the fetch script
- `src/lib/routes.ts` - Lists routes from the built `dist/` (for the route listing and screenshot scripts)
- `src/lib/constants.ts` - Shared constants (e.g., `HOME_LABEL`)
- `src/layouts/Base.astro` - Master layout with SEO, OGP meta, structured data (JSON-LD)
- `src/components/articles/OGPCard.astro` - Custom MDX component for embedding OGP previews (passed to `<Content components>` in `src/pages/articles/[slug].astro`)

### Astro 7 Specifics

- Content Layer API with `glob()` loaders (`src/content.config.ts`). Entry IDs are slug-based (e.g. `20240101-slug`), so `entry.id` IS the slug
- Use `getCollection('articles')` (not deprecated `getEntry()`)
- Use `entry.id` (not `entry.slug`)
- Use `render(entry)` function (not `entry.render()` method)

## Code Style

- **Formatter/Linter**: Biome (2-space indent, single quotes, semicolons). Covers TS, JS, Astro, JSON, and CSS
- **Imports**: Use `@/` path alias for `src/` imports; use `import type` for type-only imports
- **Naming**: camelCase (functions/variables), PascalCase (types, Astro components), UPPER_SNAKE_CASE (constants), kebab-case (utility files)
- **TypeScript**: Explicit return types on exported functions; prefer `type` over `interface` (Astro component `Props` stay as `interface Props`)
- **Astro components**: Use `class:list` for dynamic Tailwind classes
- **Tests**: Co-located in `__tests__/` directories; use `describe`/`it` with Japanese descriptions; mock external modules with `vi.mock()`
- **Styling**: Tailwind custom theme tokens (`bg-background`, `text-text-body`), fluid typography (`text-scale-0` to `text-scale-4`). Dark mode follows the OS setting: the color variables in `src/styles/base.css` switch under `prefers-color-scheme: dark` (no `dark:` classes)
