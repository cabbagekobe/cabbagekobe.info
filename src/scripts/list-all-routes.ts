import prompts from 'prompts';
import { listAllRoutes } from '../lib/routes';

async function main() {
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

  const sortedRoutes = await listAllRoutes();

  console.log('✅ All Site Routes:\n');
  for (const route of sortedRoutes) {
    console.log(`  - ${baseUrl}${route}`);
  }
  console.log(`Total: ${sortedRoutes.length} routes found.`);
}

main();
