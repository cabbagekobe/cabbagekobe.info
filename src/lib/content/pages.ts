import { getCollection } from 'astro:content';
import type { Page } from './types';

/**
 * すべてのページを取得する
 */
export const getAllPages = async (): Promise<Page[]> => {
  const pages = await getCollection('pages');
  return pages;
};
