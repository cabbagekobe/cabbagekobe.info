import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: './vitest.setup.ts',
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },
});
