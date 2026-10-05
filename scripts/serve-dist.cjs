// Serves dist/ the way Firebase Hosting will: static file, directory index, else 404.html with a
// 404 status. `npm run preview` differs (SPA fallback, trailing slashes), which hides 404 bugs.
// Run: node scripts/serve-dist.cjs [port]
const http = require('http'), fs = require('fs'), path = require('path');

const root = path.join(__dirname, '..', 'dist');
const port = Number(process.argv[2] || 4173);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };

http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    for (const file of [path.join(root, url), path.join(root, url, 'index.html'), path.join(root, url + '.html')]) {
        if (file.startsWith(root) && fs.existsSync(file) && fs.statSync(file).isFile()) {
            res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
            return res.end(fs.readFileSync(file));
        }
    }
    res.writeHead(404, { 'content-type': 'text/html' });
    res.end(fs.readFileSync(path.join(root, '404.html')));
}).listen(port, () => console.log(`serving dist/ like Firebase on http://localhost:${port}`));
