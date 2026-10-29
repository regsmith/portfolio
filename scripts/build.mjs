import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { renderPage } from '../src/page.mjs';
import { generateResume } from './pdf.mjs';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
await mkdir(dist, { recursive: true });
await Promise.all([
  writeFile(new URL('index.html', dist), renderPage()),
  ...['styles.css', 'main.js', 'favicon.svg'].map((name) => copyFile(new URL(`src/${name}`, root), new URL(name, dist))),
  generateResume(fileURLToPath(new URL('reginald-smith-resume.pdf', dist))),
]);
console.log('Built static portfolio and two-page PDF resume in dist/.');
