import http from 'node:http';
import path from 'node:path';
import { readFile, stat } from 'node:fs/promises';

// Serve the production artifact like GitHub Pages: unknown paths really load 404.html.
export async function startTestServer(directory = 'dist') {
  const root = path.resolve(directory);
  const base = '/crm-specialist';
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.xml': 'application/xml' };
  const server = http.createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (pathname !== base && !pathname.startsWith(`${base}/`)) {
        response.writeHead(404).end();
        return;
      }
      let file = path.resolve(root, `.${pathname.slice(base.length) || '/'}`);
      if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
        response.writeHead(403).end();
        return;
      }
      let status = 200;
      try {
        if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
        await stat(file);
      } catch {
        file = path.join(root, '404.html');
        status = 404;
      }
      response.writeHead(status, { 'Content-Type': `${types[path.extname(file)] || 'application/octet-stream'}; charset=utf-8`, 'Cache-Control': 'no-store' });
      response.end(await readFile(file));
    } catch {
      response.writeHead(500).end();
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { origin: `http://127.0.0.1:${server.address().port}`, close: () => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); }) };
}
