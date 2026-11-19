import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const apiUrl = (process.env['API_URL'] || 'https://mueblesjs-production.up.railway.app/api/v1').replace(/\/+$/, '');
const parsedApiUrl = new URL(apiUrl);

if (parsedApiUrl.protocol !== 'http:' && parsedApiUrl.protocol !== 'https:') {
  throw new Error('API_URL must use HTTP or HTTPS.');
}

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(scriptDirectory, '../src/app/servicios/api-url.generated.ts');

await writeFile(outputPath, `export const API_BASE_URL = ${JSON.stringify(apiUrl)};\n`);
