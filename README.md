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

## GitHub Pages

`.github/workflows/pages.yml` prepares GitHub Pages deployment using Node.js 24 and official GitHub actions pinned to commit hashes. Pull requests targeting `main` run build, PDF/content and responsive/accessibility checks without deploying. Pushes to `main`, or a manual run on `main`, deploy only the verified `dist/` artifact. The build token has read-only repository access; only the separate deployment job has Pages and OIDC write permissions.

Before the first deployment, a repository administrator must enable Pages with **GitHub Actions** as the source, confirm repository visibility/plan eligibility, and configure protection for `main` (require pull requests, block force pushes and deletion; outside approval is not required). These repository settings are not created by this workflow. The `github-pages` deployment environment should permit only `main`.

The expected project-site path is `https://regsmith.github.io/portfolio/`. No base-path rewrite is needed: local assets, resume downloads and section anchors resolve beneath `/portfolio/`. No custom domain is configured.

Publish only the explicit sanitized production branch. Local privacy-backup refs, checkpoint refs and reflogs retain the original commit identities for recovery and must never be mirrored to GitHub. Do not use `git push --mirror`.
