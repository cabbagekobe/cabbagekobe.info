// src/__tests__/site.config.test.ts
import { siteConfig } from '../site.config';

describe('siteConfig', () => {
  test('should have a title', () => {
    expect(siteConfig.title).toBeDefined();
    expect(typeof siteConfig.title).toBe('string');
    expect(siteConfig.title.length).toBeGreaterThan(0);
  });

  test('should have a description', () => {
    expect(siteConfig.description).toBeDefined();
    expect(typeof siteConfig.description).toBe('string');
    expect(siteConfig.description.length).toBeGreaterThan(0);
  });

  test('should have a siteUrl', () => {
    expect(siteConfig.siteUrl).toBeDefined();
    expect(typeof siteConfig.siteUrl).toBe('string');
    expect(siteConfig.siteUrl).toMatch(/^https?:\/\/.+/);
  });

  test('should have articlesPerPage as a positive number', () => {
    expect(siteConfig.articlesPerPage).toBeDefined();
    expect(typeof siteConfig.articlesPerPage).toBe('number');
    expect(siteConfig.articlesPerPage).toBeGreaterThan(0);
  });

  test('should have a layout width defined', () => {
    expect(siteConfig.layout).toBeDefined();
    expect(siteConfig.layout.width).toBeDefined();
    expect(typeof siteConfig.layout.width).toBe('string');
    expect(siteConfig.layout.width.length).toBeGreaterThan(0);
  });
});
