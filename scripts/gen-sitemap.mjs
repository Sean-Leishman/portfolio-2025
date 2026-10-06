// Post-build: sitemap.xml + robots.txt from the pages react-snap actually wrote.
import fs from 'fs';
import path from 'path';

const site = (process.env.SITE_URL ?? 'https://2025-portfolio.web.app').replace(/\/$/, '');
const dist = 'dist';

const pages = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? pages(path.join(dir, e.name))
        : e.name === 'index.html' ? ['/' + path.relative(dist, dir)] : []);

// 200.html/404.html are react-snap's SPA fallbacks, not pages
const urls = pages(dist).filter((p) => p !== '/404' && p !== '/feed.xml').sort();
const today = new Date().toISOString().slice(0, 10);

// the titles come from React's hoisted <title>; if that ever stops working, every page loses one
const untitled = urls.filter((u) => !/<title>[^<]+<\/title>/.test(fs.readFileSync(path.join(dist, u, 'index.html'), 'utf-8')));
if (untitled.length) throw new Error(`gen-sitemap: no <title> on ${untitled.join(', ')}`);

fs.writeFileSync(path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
    + urls.map((u) => `  <url><loc>${site}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')
    + `\n</urlset>\n`);

fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
// Firebase serves 404.html for unmatched paths (no catch-all rewrite), so it must be the real
// Not-found page rather than react-snap's empty shell.
fs.copyFileSync(path.join(dist, '404', 'index.html'), path.join(dist, '404.html'));

console.log(`gen-sitemap: ${urls.length} urls`);
