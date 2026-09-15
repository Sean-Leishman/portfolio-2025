// Fails if any pre-rendered page hits a React hydration error (light and dark theme).
// Run: npm run build && npm run preview, then in another shell: node scripts/check-hydration.cjs
//
// Hydration breaks silently: React logs #418, throws away react-snap's HTML and re-renders,
// which undoes the LCP win. The usual cause is JSX that renders adjacent text nodes
// (`{a} · {b}`, or a library emitting text runs) -- the pre-rendered HTML has them merged.
// Uses react-snap's bundled puppeteer, so no extra dependency.
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const base = process.env.BASE_URL || 'http://localhost:4173';
// trailing slash: vite preview only serves posts/index.html at /posts/ (Firebase serves /posts)
const pages = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? pages(path.join(dir, e.name)) : e.name === 'index.html' ? ['/' + path.relative('dist', dir) + '/'] : []);

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    let failures = 0;
    for (const theme of ['light', 'dark']) {
        for (const url of pages('dist').map((p) => p.replace(/^\/\/$/, '/'))) {
            const page = await browser.newPage();
            const errors = [];
            page.on('console', (m) => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && errors.push(m.text()));
            page.on('pageerror', (e) => errors.push(e.message));
            await page.goto(base, { waitUntil: 'domcontentloaded' });
            await page.evaluate((t) => localStorage.setItem('theme', t), theme);
            await page.goto(base + url, { waitUntil: 'networkidle0' });
            if (errors.length) failures++;
            console.log(`${errors.length ? 'FAIL' : 'ok  '} ${theme} ${url}`);
            await page.close();
        }
    }
    await browser.close();
    process.exit(failures ? 1 : 0);
})();
