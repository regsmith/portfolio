import PDFDocument from 'pdfkit';
import { createWriteStream } from 'node:fs';
import { finished } from 'node:stream/promises';
import { resume as r } from '../src/content.mjs';

export async function generateResume(path) {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 40,
    bufferPages: true,
    info: { Title: `${r.name} - Resume`, Author: r.name, Subject: r.headline, Keywords: r.skills.flatMap((s) => s.items).join(', ') },
  });
  const output = createWriteStream(path);
  doc.pipe(output);
  const width = doc.page.width - 80;
  const ink = '#172a2c';
  const accent = '#a64020';
  const text = (value, size = 10.5, options = {}) => {
    doc.font('Helvetica').fontSize(size).fillColor(ink).text(value, { width, lineGap: 2, ...options });
  };
  const heading = (value) => {
    doc.moveDown(.8);
    doc.font('Helvetica-Bold').fontSize(11).fillColor(accent).text(value.toUpperCase(), { width, lineGap: 2 });
    doc.moveDown(.4);
  };
  const title = (value) => doc.font('Helvetica-Bold').fontSize(10.5).fillColor(ink).text(value, { width, lineGap: 2 });
  const link = (label, url) => text(`${label}: ${url}`, 10, { link: url, underline: true });
  const project = (w) => {
    title(`${w.category} | ${w.dates}`);
    text(w.summary);
    for (const bullet of w.bullets) {
      text(`- ${bullet}`, 10, { indent: 7 });
    }
    doc.moveDown(.65);
  };

  doc.font('Helvetica-Bold').fontSize(27).fillColor(ink).text(r.name, { width });
  text(r.headline, 12);
  doc.moveDown(.3);
  link('LinkedIn', r.linkedin);
  doc.moveDown(.6);
  text(r.introduction);
  heading('Experience');
  title(`${r.employer} | ${r.title} | ${r.tenure}`);
  text(r.grade);
  doc.moveDown(.35);
  text('Responsibility phases:', 10);
  for (const p of r.phases) text(`${p.name}: ${p.dates}`, 10);
  text(r.management, 10);
  heading('Skills');
  for (const group of r.skills) {
    title(group.name);
    text(group.items.join(' / '), 10);
    doc.moveDown(.3);
  }
  heading('Selected Cisco work');
  project(r.work[0]);
  project(r.work[1]);

  doc.addPage();
  doc.font('Helvetica-Bold').fontSize(16).fillColor(ink).text(r.name, { width });
  text('Resume / continued', 9);
  heading('Selected Cisco work / continued');
  project(r.work[2]);
  project(r.work[3]);
  heading('How I work');
  for (const approach of r.approach) {
    title(approach.title);
    text(approach.text, 10);
    doc.moveDown(.3);
  }
  heading('Education');
  title(`${r.education.institution} | ${r.education.year}`);
  text(r.education.qualification);
  heading('Selected personal projects & interests');
  for (const p of r.personal) {
    title(`${p.title} | ${p.dates}`);
    text(p.text, 10);
    for (const l of p.links) link(l.label, l.url);
    doc.moveDown(.5);
  }

  const { count } = doc.bufferedPageRange();
  if (count !== 2) throw new Error(`Resume must fit two pages; generated ${count}. Revise the layout or content.`);
  for (let i = 0; i < count; i++) {
    doc.switchToPage(i);
    const bottom = doc.page.height - 30;
    const bottomMargin = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    doc.font('Helvetica').fontSize(8).fillColor('#4e6060').text(`${r.name} | ${i + 1} / ${count}`, 40, bottom, { width, lineBreak: false });
    doc.page.margins.bottom = bottomMargin;
  }
  if (doc.bufferedPageRange().count !== 2) throw new Error('Resume footer overflowed the two-page layout.');
  doc.end();
  await finished(output);
}
