import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { resume as r } from '../src/content.mjs';
import { escapeHtml, renderPage } from '../src/page.mjs';

const normalize = (value) => value.replace(/\s+/g, ' ').trim();

test('semantic page exposes every shared career fact without JavaScript', () => {
  const html = renderPage();
  for (const value of [
    r.name, r.headline, r.introduction, r.title, r.tenure, r.grade, r.management,
    ...r.phases.flatMap((p) => [p.name, p.dates]),
    ...r.work.flatMap((w) => [w.title, w.summary, w.dates, ...w.bullets, ...w.tags]),
    ...r.skills.flatMap((s) => s.items),
    ...r.approach.flatMap((a) => [a.title, a.text]),
    ...r.personal.flatMap((p) => [p.title, p.text, ...p.links.flatMap((l) => [l.label, l.url])]),
    ...Object.values(r.education),
  ]) assert.ok(html.includes(escapeHtml(value)), `Missing visible content: ${value}`);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<main id="main">/);
  const structured = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.equal(structured.jobTitle, r.title);
  assert.equal(structured.worksFor.name, r.employer);
  assert.deepEqual(structured.sameAs, [r.linkedin]);
  assert.doesNotMatch(html, /mailto:|tel:|hello@example|BES|CSDL|~50|45-60%|AI &amp; engineering/);
  assert.match(html, /not the entire pipeline/);
});

test('HTML escaping prevents content from changing markup', () => {
  assert.equal(escapeHtml('<a title="x">&\'</a>'), '&lt;a title=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;');
});

test('generated PDF is two searchable pages, contains shared facts and live links, and does not clip', async () => {
  const bytes = await readFile(new URL('../dist/reginald-smith-resume.pdf', import.meta.url));
  assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
  const loading = getDocument({ data: new Uint8Array(bytes), useSystemFonts: true });
  const pdf = await loading.promise;
  assert.equal(pdf.numPages, 2);
  const pages = [];
  const urls = [];
  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    const { items } = await page.getTextContent();
    pages.push(items.filter((item) => 'str' in item).map((item) => item.str).join(' '));
    for (const item of items.filter((item) => 'str' in item && item.str.trim())) {
      assert.ok(item.transform[5] > 15, `Text below bottom margin: ${item.str}`);
      assert.ok(item.transform[4] >= 39, `Text outside left margin: ${item.str}`);
      assert.ok(item.transform[4] + item.width <= page.view[2] - 35, `Text outside right margin: ${item.str}`);
    }
    urls.push(...(await page.getAnnotations()).filter((a) => a.url).map((a) => a.url));
  }
  const text = normalize(pages.join(' '));
  for (const fact of [
    r.name, r.headline, r.introduction, r.title, r.tenure, r.grade, r.management,
    ...r.phases.flatMap((p) => [p.name, p.dates]),
    ...r.work.flatMap((w) => [w.summary, w.dates, ...w.bullets]),
    ...r.skills.flatMap((s) => s.items),
    ...r.approach.flatMap((a) => [a.title, a.text]),
    ...Object.values(r.education),
    ...r.personal.flatMap((p) => [p.title, p.text, p.dates]),
  ]) assert.ok(text.includes(normalize(fact)), `PDF missing fact: ${fact}`);
  for (const url of [r.linkedin, ...r.personal.flatMap((p) => p.links.map((l) => l.url))]) {
    assert.ok(urls.includes(url), `PDF missing live link: ${url}`);
  }
  assert.match(pages[0], /1 \/ 2/);
  assert.match(pages[1], /2 \/ 2/);
  await loading.destroy();
});
