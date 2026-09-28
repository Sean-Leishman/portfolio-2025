// Fails on Tailwind class names that do not exist. They fail silently in the browser:
// `text-bold` and `text-semibold` in mdxComponents.tsx meant every in-post heading rendered at
// body weight for months. Run: node scripts/check-classes.mjs (part of `npm run lint`).
import fs from 'fs';
import path from 'path';

const WEIGHTS = ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'];
const SIZES = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'];
// weights belong to font-, sizes to text-; swapping them silently does nothing
const BAD = new RegExp(`\\b(?:text-(?:${WEIGHTS.join('|')})|font-(?:${SIZES.join('|')})|text-italic|font-underline)\\b`, 'g');

const files = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(path.join(dir, e.name)) : /\.(tsx?|css|mdx)$/.test(e.name) ? [path.join(dir, e.name)] : []);

let found = 0;
for (const file of files('src')) {
    fs.readFileSync(file, 'utf-8').split('\n').forEach((line, i) => {
        for (const hit of line.match(BAD) ?? []) {
            console.error(`${file}:${i + 1}  ${hit}`);
            found++;
        }
    });
}
if (found) {
    console.error(`\n${found} invalid class name(s): weights go on font-, sizes on text-.`);
    process.exit(1);
}
console.log('check-classes: ok');
