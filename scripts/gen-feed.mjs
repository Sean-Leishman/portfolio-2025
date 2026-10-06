// Post-build: an RSS feed from the same manifest the pages are built from, so it cannot drift.
import fs from 'fs';
import path from 'path';

const site = (process.env.SITE_URL ?? 'https://2025-portfolio.web.app').replace(/\/$/, '');
const { posts } = JSON.parse(fs.readFileSync('src/generated/content.json', 'utf-8'));

// react-snap follows the <link rel="alternate"> in index.html and writes dist/feed.xml/index.html,
// turning the path into a directory. Clear it before writing the real file.
const out = path.join('dist', 'feed.xml');
if (fs.existsSync(out) && fs.statSync(out).isDirectory()) fs.rmSync(out, { recursive: true });

const escape = (s = '') => s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
const rfc822 = (date) => new Date(`${date}T12:00:00Z`).toUTCString();

const items = posts.map((post) => `    <item>
      <title>${escape(post.title)}</title>
      <link>${site}${post.link}</link>
      <guid isPermaLink="true">${site}${post.link}</guid>
      <pubDate>${rfc822(post.date)}</pubDate>
      ${post.summary ? `<description>${escape(post.summary)}</description>` : ''}
    </item>`).join('\n');

fs.writeFileSync(out, `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Sean Leishman</title>
    <link>${site}</link>
    <description>Projects, papers and writing by Sean Leishman.</description>
    <language>en-GB</language>
    <atom:link href="${site}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`);
console.log(`gen-feed: ${posts.length} items`);
