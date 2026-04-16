import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { MarkdownInstance } from 'astro';
import type { Frontmatter } from '@/lib/content/types';
import { getEntrySlug } from '@/lib/content/utils';

interface ArticleFile {
  filepath: string;
  slug: string;
}

function virtualToAbsolute(virtualPath: string): string {
  return path.resolve(process.cwd(), virtualPath.replace('/src/', 'src/'));
}

export async function getStaticPaths() {
  const mdModules = import.meta.glob<MarkdownInstance<Frontmatter>>([
    '/src/content/articles/**/*.md',
    '/src/content/articles/*.md',
  ]);

  const mdxModules = import.meta.glob<MarkdownInstance<Frontmatter>>([
    '/src/content/articles/**/*.mdx',
    '/src/content/articles/*.mdx',
  ]);

  const allModules = { ...mdModules, ...mdxModules };
  const files: ArticleFile[] = [];

  for (const filepath of Object.keys(allModules)) {
    const parts = filepath.split('/');
    const contentIndex = parts.indexOf('articles');
    if (contentIndex === -1) continue;

    const id = parts.slice(contentIndex + 1).join('/');
    const slug = getEntrySlug(id);
    if (slug) {
      files.push({ filepath, slug });
    }
  }

  return files.map(({ slug, filepath }) => ({
    params: { slug },
    props: { filepath },
  }));
}

export async function GET({ props }: { props: { filepath: string } }) {
  const absolutePath = virtualToAbsolute(props.filepath);
  const content = await readFile(absolutePath, 'utf-8');

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}
