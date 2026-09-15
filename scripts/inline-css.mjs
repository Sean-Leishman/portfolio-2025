// Post-build: inline the stylesheet into every pre-rendered page and preload the body font.
// The CSS is ~5KB gzipped; as a <link> it was a render-blocking round trip before first paint,
// and the font it names was only discovered after that trip. Run after react-snap.
import fs from 'fs';
import path from 'path';

const dist = 'dist';
const htmlFiles = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? htmlFiles(path.join(dir, e.name)) : e.name.endsWith('.html') ? [path.join(dir, e.name)] : []);

let inlined = 0;
for (const file of htmlFiles(dist)) {
    let html = fs.readFileSync(file, 'utf-8');
    html = html.replace(/<link[^>]*href="(\/src\/assets\/index-[^"]+\.css)"[^>]*>/, (_, href) => {
        const css = fs.readFileSync(path.join(dist, href), 'utf-8');
        const font = css.match(/url\((\/src\/assets\/merriweather-(?!italic|sans)[\w-]+\.woff2)\)/)?.[1];
        const preload = font ? `<link rel="preload" href="${font}" as="font" type="font/woff2" crossorigin>` : '';
        inlined++;
        return `${preload}<style>${css}</style>`;
    });
    fs.writeFileSync(file, html);
}
if (!inlined) throw new Error('inline-css: no stylesheet link found; did the CSS output name change?');
console.log(`inline-css: inlined into ${inlined} page(s)`);
