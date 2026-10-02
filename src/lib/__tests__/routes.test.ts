import fg from 'fast-glob';
import { describe, expect, it, vi } from 'vitest';
import { listAllRoutes } from '../routes';

vi.mock('fast-glob', () => ({
  default: vi.fn(),
}));

describe('listAllRoutes', () => {
  it('ビルド済みの HTML からルートを導出し、ソートして返す', async () => {
    vi.mocked(fg).mockResolvedValue([
      'index.html',
      'articles/index.html',
      'articles/20230208-cool/index.html',
      'about/index.html',
      '404.html',
    ]);

    expect(await listAllRoutes()).toEqual([
      '/',
      '/404.html',
      '/about/',
      '/articles/',
      '/articles/20230208-cool/',
    ]);
    expect(fg).toHaveBeenCalledWith('**/*.html', { cwd: 'dist' });
  });
});
