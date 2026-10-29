# Reginald Smith / Portfolio

A career-first, responsive static portfolio and generated two-page PDF resume. No frontend framework, remote fonts, analytics, contact form or runtime service is required.

## Local use

Requires Node.js 22.13 or newer.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4173`. The server binds to loopback only. After editing, rerun the build and refresh; there is no watcher. Set `PORT` to change the local port.

```sh
npm run build
npm test
npx playwright install chromium
npm run test:browser
```

`npm run build` generates `dist/index.html`, local CSS/JavaScript/icon assets and `dist/reginald-smith-resume.pdf`. The browser check starts and stops its own local server and checks desktop/mobile layouts, keyboard navigation, reduced motion, accessibility and PDF downloads. It requires a free port 4174.

## Content and maintenance

Edit **`src/content.mjs`** for professional facts, dates, evidence, skills, personal projects and links. Both the semantic HTML page and the actual PDF are generated from that source. The PDF is a concise resume selection, not a screenshot of the website; longer narrative sections stay on the page. The generator fails if the resume no longer fits two pages, so layout changes are deliberate.

`src/page.mjs` contains page structure and Person structured data; `src/styles.css` contains responsive, print and reduced-motion styles. `src/main.js` progressively enhances the mobile navigation: links remain available without JavaScript. No build-time network requests or external assets are needed.

Keep the formal title separate from responsibility phases and current grade. The published timing comparison applies only to the Windows SonarQube stage. Do not add private contact information, internal project details or unapproved metrics.

The site uses relative asset and PDF links so it can be served from a subdirectory. Deploy the contents of `dist/` to a static host when hosting is in scope. No domain or canonical URL is assumed.
