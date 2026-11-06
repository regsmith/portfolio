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
    ...r.careerHighlights.flatMap((item) => [item.dates, item.text]),
    r.certification.name, r.certification.date, r.certification.activities,
    ...r.work.flatMap((w) => [w.title, w.summary, w.dates, ...w.bullets, ...w.tags]),
    ...r.skills.flatMap((s) => s.items),
    ...r.approach.flatMap((a) => [a.title, a.text]),
    ...r.personal.flatMap((p) => [p.title, p.text, ...p.links.flatMap((l) => [l.label, l.url])]),
    ...Object.values(r.education),
  ]) assert.ok(html.includes(escapeHtml(value)), `Missing visible content: ${value}`);
  assert.ok(html.includes("I've grown from manual test verification to developing full automation suites and into a technical and team leader."));
  assert.ok(html.includes('Spec-driven development and multi-agent feature delivery'));
  assert.ok(html.includes('Scrum facilitation'));
  assert.doesNotMatch(html, /without stepping away from the work|not held throughout my tenure|Overlapping scopes within my formal Software Developer role|Scrum facilitation \/ master/);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.ok(html.indexOf('id="toolkit"') < html.indexOf('id="work"'), 'Skills should precede selected work on the page');
  assert.ok(html.indexOf('id="work"') < html.indexOf('id="career"'), 'Career experience should follow Skills in practice');
  assert.match(html, /aria-label="Engineering strengths"/);
  assert.match(html, /Quality-minded automation/);
  assert.doesNotMatch(html.slice(0, html.indexOf('id="work"')), /Windows SonarQube stage|45-60|4-10/);
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
    ...r.careerHighlights.flatMap((item) => [item.dates, item.text]),
    r.certification.name, r.certification.date, r.certification.activities,
    ...r.skills.flatMap((s) => s.items),
    ...r.approach.flatMap((a) => [a.title, a.text]),
    ...Object.values(r.education),
    ...r.personal.flatMap((p) => [p.title, p.text, p.dates]),
  ]) assert.ok(text.includes(normalize(fact)), `PDF missing fact: ${fact}`);
  for (const removed of ['without stepping away from the work', 'current level, not held throughout tenure', 'overlapping scopes, not separate job titles', 'Scrum facilitation / master']) {
    assert.ok(!text.includes(removed), `PDF contains removed wording: ${removed}`);
  }
  for (const url of [r.linkedin, ...r.personal.flatMap((p) => p.links.map((l) => l.url))]) {
    assert.ok(urls.includes(url), `PDF missing live link: ${url}`);
  }
  assert.match(pages[0], /1 \/ 2/);
  assert.match(pages[1], /2 \/ 2/);
  assert.ok(pages[0].toLowerCase().indexOf('skills') < pages[0].toLowerCase().indexOf('career experience'), 'Qualifications should precede career experience in the resume');
  await loading.destroy();
});
