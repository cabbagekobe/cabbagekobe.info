# AGENTS.md

Guidelines for AI agents working on this codebase.

## Project Overview

This is an Astro-based static site (cabbagekobe.info) using TypeScript, Tailwind CSS, and MDX for content.

## Build/Lint/Test Commands

```bash
# Development
npm run dev           # Start dev server with prebuild
npm run build         # Production build
npm run preview       # Preview production build
npm run clean         # Remove dist and .astro directories

# Testing (Vitest)
npm run test                    # Run all tests once
npx vitest run <pattern>        # Run tests matching pattern
npx vitest run src/lib/content  # Run tests in specific directory
npx vitest run --reporter=verbose  # Verbose output

# Linting/Formatting (Biome)
npm run lint          # Lint and auto-fix issues
npm run format        # Format code with Biome

# Type checking
npm run typecheck     # astro check

# Full CI check
npm run check-all     # build + lint + typecheck + test
```

## Code Style Guidelines

### Formatting (Biome)
- 2-space indentation
- Single quotes for JavaScript/TypeScript
- Semicolons required
- 80 character line width (default)

### Imports
- Use `@/` path alias for `src/` imports: `import { x } from '@/lib/utils'`
- Organize imports: Biome's `organizeImports` is enabled
- Type imports: Use `import type { Foo } from '...'`

### Naming Conventions
- **Variables/functions**: camelCase (`getArticles`, `articleList`)
- **Types/interfaces**: PascalCase (`Article`, `ArticlePageProps`)
- **Constants**: UPPER_SNAKE_CASE for true constants
- **Files**: kebab-case for utilities (`articles.ts`, `page-loader.ts`)
- **Astro components**: PascalCase (`Header.astro`, `OGPCard.astro`)

### TypeScript
- Use explicit return types on exported functions
- Prefer `type` over `interface` for object shapes
- JSDoc comments for public functions (Japanese OK for this project)
- Strict null checks enabled implicitly

### Error Handling
- Use early returns to reduce nesting
- Validate data with Zod schemas (see `src/content/config.ts`)
- Async functions should handle errors at call site

### Astro Components
- Use `class:list` for dynamic Tailwind classes
- Props interface defined in frontmatter with `Props` type
- Path alias: `@/components/...`

### Testing
- Tests co-located: `src/lib/__tests__/example.test.ts`
- Use `describe`/`it` blocks with descriptive Japanese names
- Mock external modules with `vi.mock()`
- Import from `vitest`: `import { describe, expect, it, vi } from 'vitest'`

### Content Collections
- Articles in `src/content/articles/YYYYMMD-slug/index.{md,mdx}`
- Schema defined in `src/lib/schema.ts`
- Supports both `.md` and `.mdx` file extensions
- Frontmatter: `title`, `published_at` (required), optional fields per schema

### Styling (Tailwind)
- Use custom colors from theme: `bg-background`, `text-text-body`
- Fluid typography: `text-scale-0`, `text-scale-1`, etc.
- Dark mode: `dark:` prefix classes

## Project Structure

```
src/
  components/      # Astro components (PascalCase)
  content/         # MDX content collections
    articles/      # Blog posts
    pages/         # Static pages
  layouts/         # Astro layouts
  lib/             # Utility functions
    content/       # Content-related utilities
  scripts/         # Build scripts (tsx)
  pages/           # Astro routes
  site.config.ts   # Site configuration
```

## Common Tasks

- **New article**: `npm run new:article` (interactive prompt)
- **List routes**: `npm run list:routes`
- **Screenshots**: `npm run screenshot:pages` (requires Playwright)

## Astro 7 Migration Notes

When working with content collections in Astro 7 (Content Layer API with `glob()` loaders):
- Use `getCollection('articles')` instead of deprecated `getEntry()`
- Use `entry.id` instead of `entry.slug` — entry IDs are slug-based (e.g. `20240101-slug`), so `entry.id` IS the slug
- Use `render(entry)` function instead of `entry.render()` method
- The `getEntrySlug(id)` utility from `@/lib/content/utils` extracts slugs from file paths (used by fs-based loading in `files.ts`); it is not needed for Collection entries

## Notes

- This is a Japanese-language site; comments and JSDoc may be in Japanese
- OGP data fetched at build time via `src/scripts/fetch-ogp.mjs`
- Static export: `output: 'static'` in Astro config
