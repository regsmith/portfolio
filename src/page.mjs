import { resume as r } from './content.mjs';

export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const e = escapeHtml;
const arrow = '<span aria-hidden="true">↗</span>';
const links = (items) => items.map(({ label, url }) => `<a class="text-link" href="${e(url)}">${e(label)} ${arrow}</a>`).join('');
const nav = [['career', 'Experience'], ['toolkit', 'Skills'], ['work', 'Selected work'], ['approach', 'How I work'], ['personal', 'Off the clock']];

export function renderPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: r.name,
    jobTitle: r.title,
    description: r.introduction,
    sameAs: [r.linkedin],
    worksFor: { '@type': 'Organization', name: r.employer },
    alumniOf: { '@type': 'CollegeOrUniversity', name: r.education.institution },
    knowsAbout: r.skills.flatMap((group) => group.items),
  };
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${e(`${r.name} — ${r.headline}. Cisco career, CI/CD, build infrastructure, QA automation and engineering leadership.`)}">
  <meta name="theme-color" content="#f6f3eb">
  <meta property="og:type" content="profile">
  <meta property="og:title" content="${e(r.name)} | Software & security engineering">
  <meta property="og:description" content="${e(r.introduction)}">
  <title>${e(r.name)} | Software & security engineering</title>
  <link rel="icon" href="./favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="./styles.css">
  <script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, '\\u003c')}</script>
  <script src="./main.js" defer></script>
</head>
<body id="top">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header shell">
    <a class="brand" href="#top"><span class="monogram" aria-hidden="true">rs.</span><span>${e(r.name)}</span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" hidden>Menu <span aria-hidden="true">+</span></button>
    <nav id="primary-nav" aria-label="Main navigation">${nav.map(([id, label]) => `<a href="#${id}">${label}</a>`).join('')}<a class="nav-contact" href="#contact">Let's connect ${arrow}</a></nav>
  </header>
  <main id="main">
    <section class="hero shell" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow"><span class="status-dot" aria-hidden="true"></span> ${e(r.headline)}</p>
        <h1 id="hero-title">Good systems.<br>Stronger teams.<br><em>Real impact.</em></h1>
        <p class="intro">${e(r.introduction)}</p>
        <div class="actions"><a class="button dark" href="#toolkit">Explore my skills <span aria-hidden="true">↓</span></a><a class="text-link" href="./reginald-smith-resume.pdf" download>Download resume <span class="file-label">PDF</span> ${arrow}</a></div>
      </div>
      <aside class="hero-panel" aria-label="Engineering strengths">
        <div class="panel-top"><span>HOW I ADD VALUE</span><span aria-hidden="true">[ RS ]</span></div>
        <div class="system-art" aria-hidden="true"><div class="system-ring"></div><span class="node node-one">AUTOMATE</span><span class="node node-two">DELIVER</span><span class="node node-three">LEAD</span><span class="art-center">Engineering<br><em>that connects.</em></span></div>
        <div class="panel-metric"><ul class="strength-list"><li>Quality-minded automation</li><li>Cross-platform delivery</li><li>Technical &amp; team leadership</li></ul></div>
      </aside>
    </section>
    <div class="signal-band"><div class="shell signal-grid"><p><strong>${e(r.employer)}</strong><span>${e(r.tenure)}</span></p><p><strong>Hands-on + leadership</strong><span>Automation, infrastructure & people</span></p><p><strong>Three platforms</strong><span>Windows / macOS / Linux</span></p></div></div>
    <section id="toolkit" class="section toolkit shell" aria-labelledby="toolkit-title"><div class="section-heading"><div><p class="eyebrow">01 / Skills &amp; qualifications</p><h2 id="toolkit-title">Across the <em>stack.</em></h2></div><p>Tools I use. Systems I understand. Teams I help move forward.</p></div><div class="skills-grid">${r.skills.map((s) => `<article><h3>${e(s.name)}</h3><ul>${s.items.map((item) => `<li>${e(item)}</li>`).join('')}</ul></article>`).join('')}</div></section>
    <section id="work" class="section work-section shell" aria-labelledby="work-title">
      <div class="section-heading"><div><p class="eyebrow">02 / Selected Cisco work</p><h2 id="work-title">Skills in <em>practice.</em></h2></div><p>Practical changes to how security software gets built, tested and delivered.</p></div>
      <div class="work-grid">${r.work.map((w, index) => `<article class="work-card work-${index}" aria-labelledby="${w.id}-title"><div class="card-top"><span>${String(index + 1).padStart(2, '0')} / ${e(w.category)}</span><span>${e(w.dates)}</span></div><h3 id="${w.id}-title">${e(w.title)}</h3><p class="work-summary">${e(w.summary)}</p><ul class="evidence">${w.bullets.map((b) => `<li>${e(b)}</li>`).join('')}</ul><ul class="tags" aria-label="Tools and focus">${w.tags.map((t) => `<li>${e(t)}</li>`).join('')}</ul></article>`).join('')}</div>
    </section>
    <section id="career" class="section career-history shell" aria-labelledby="career-title">
      <div class="section-heading"><div><p class="eyebrow">03 / Career experience</p><h2 id="career-title">A track record of <em>delivery.</em></h2></div><p>One formal role, with work spanning quality automation, cloud infrastructure, secure delivery and team leadership.</p></div>
      <article class="history-entry">
        <header class="history-header"><div><h3>${e(r.employer)}</h3><p>${e(r.title)} <span aria-hidden="true">·</span> ${e(r.tenure)}</p></div><strong>${e(r.grade)}</strong></header>
        <ul class="history-highlights">${r.careerHighlights.map((item) => `<li><span class="date">${e(item.dates)}</span><p>${e(item.text)}</p></li>`).join('')}</ul>
        <div class="history-leadership"><div><h4>Responsibility phases</h4><ul class="phase-inline">${r.phases.map((p) => `<li><strong>${e(p.name)}</strong><span>${e(p.dates)}</span></li>`).join('')}</ul><p>${e(r.management)}</p></div><div><h4>${e(r.certification.name)} · ${e(r.certification.date)}</h4><p>${e(r.certification.activities)}</p></div></div>
      </article>
      <aside class="history-education" aria-labelledby="education-title"><p class="eyebrow">Education · ${e(r.education.year)}</p><h3 id="education-title">${e(r.education.institution)}</h3><p>${e(r.education.qualification)}</p></aside>
    </section>
    <section id="approach" class="approach-band" aria-labelledby="approach-title"><div class="section shell"><div class="section-heading"><div><p class="eyebrow">04 / How I work</p><h2 id="approach-title">Good engineering.<br><em>Grounded in practice.</em></h2></div></div><div class="approach-grid">${r.approach.map((a, i) => `<article><span class="approach-number">0${i + 1}</span><h3>${e(a.title)}</h3><p>${e(a.text)}</p></article>`).join('')}</div></div></section>
    <section id="personal" class="section shell" aria-labelledby="personal-title"><div class="section-heading"><div><p class="eyebrow">05 / Off the clock</p><h2 id="personal-title">A builder.<br><em>Not just at work.</em></h2></div><p>A few things that keep me curious, creative and connected.</p></div><div class="personal-grid">${r.personal.map((p, i) => `<article class="personal-card"><div class="personal-icon" aria-hidden="true">${i === 0 ? '01 / PLAYBOOK' : '02 / SOUND CHECK'}</div><p class="eyebrow">${e(p.category)}</p><h3>${e(p.title)}</h3><p class="date">${e(p.dates)}</p><p>${e(p.text)}</p><div class="personal-links">${links(p.links)}</div></article>`).join('')}</div></section>
    <section id="contact" class="shell contact" aria-labelledby="contact-title"><div><p class="eyebrow">Let's connect</p><h2 id="contact-title">Your next challenge.<br><em>My kind of problem.</em></h2></div><div><p>I'm interested in software and security engineering opportunities where dependable systems and thoughtful leadership matter.</p><a class="button dark" href="${e(r.linkedin)}">Connect on LinkedIn ${arrow}</a><a class="resume-link" href="./reginald-smith-resume.pdf" download>Download my resume (PDF) ${arrow}</a></div></section>
  </main>
  <footer class="shell"><span>© ${new Date().getUTCFullYear()} ${e(r.name)}</span><span>Software. Security. A human touch.</span><a href="#top">Back to top ↑</a></footer>
</body>
</html>`;
}
