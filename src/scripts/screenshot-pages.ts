import * as fs from 'node:fs';
import * as path from 'node:path';
import { chromium } from 'playwright';
import prompts from 'prompts';
import { listAllRoutes } from '../lib/routes';

async function takeScreenshots() {
  const response = await prompts({
    type: 'text',
    name: 'baseUrl',
    message:
      'Enter the base URL of your local preview server (e.g., http://localhost:4321)',
    initial: 'http://localhost:4321',
  });

  const baseUrl = response.baseUrl;
  if (!baseUrl) {
    console.error('Base URL is required.');
    process.exit(1);
  }

  const outputDir = 'dist/screenshots';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('Fetching routes...');
  const routes = await listAllRoutes(); // Get routes directly

  if (routes.length === 0) {
    console.warn('No routes found.');
    await browser.close();
    process.exit(0);
  }

  let screenshotCount = 0;
  for (const route of routes) {
    const relativePath = route;
    const fullUrl = `${baseUrl}${relativePath}`;
    const filename = path.join(
      outputDir,
      relativePath === '/'
        ? 'index.png'
        : `${relativePath.replace(/\//g, '_')}.png`,
    );

    console.log(`📸 Capturing: ${fullUrl} -> ${filename}`);
    try {
      await page.goto(fullUrl, { waitUntil: 'networkidle' });
      await page.screenshot({ path: filename, fullPage: true });
      screenshotCount++;
    } catch (error) {
      console.error(`❌ Failed to capture ${fullUrl}: ${error}`);
    }
  }

  await browser.close();
  console.log(`\n✅ Captured ${screenshotCount} screenshots in ${outputDir}.`);
}

takeScreenshots();
