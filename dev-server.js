const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const host = '127.0.0.1';
const port = Number(process.env.CUTTING_DEV_PORT) || 5500;
const clients = new Set();
const mime = {
  '.css': 'text/css', '.html': 'text/html', '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.js': 'text/javascript',
  '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2'
};
const reloadScript = '<script>const reloadEvents=new EventSource("/__dev/events");let cuttingPointerActive=false,cuttingReloadQueued=false;const cuttingFinishPointer=()=>{cuttingPointerActive=false;if(cuttingReloadQueued){cuttingReloadQueued=false;location.reload()}};addEventListener("pointerdown",()=>{cuttingPointerActive=true},true);addEventListener("pointerup",cuttingFinishPointer,true);addEventListener("pointercancel",cuttingFinishPointer,true);reloadEvents.addEventListener("reload",()=>{if(cuttingPointerActive||document.querySelector(".dragging,.dragGhost")){cuttingReloadQueued=true;return}location.reload()});</script>';

const server = http.createServer(async (request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, `http://${host}`).pathname); }
  catch { response.writeHead(400).end(); return; }

  if (pathname === '/__dev/events') {
    response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });
    response.write(': connected\n\n');
    clients.add(response);
    request.on('close', () => clients.delete(response));
    return;
  }

  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  const relative = path.relative(root, file);
  const served = relative === 'index.html' || relative === 'favicon.ico' || relative === 'logo.png'
    || relative.startsWith(`src${path.sep}`) || relative.startsWith(`assets${path.sep}`);
  if (!served || relative.startsWith('..') || path.isAbsolute(relative)) {
    response.writeHead(403).end();
    return;
  }

  try {
    const content = await fs.promises.readFile(file);
    const extension = path.extname(file).toLowerCase();
    const body = extension === '.html'
      ? Buffer.from(content.toString().replace(/<\/body>/i, `${reloadScript}</body>`))
      : content;
    response.writeHead(200, {
      'Content-Type': `${mime[extension] || 'application/octet-stream'}; charset=utf-8`,
      'Cache-Control': 'no-store'
    });
    response.end(body);
  } catch (error) {
    response.writeHead(error.code === 'ENOENT' || error.code === 'EISDIR' ? 404 : 500).end();
  }
});

let reloadTimer;
for (const directory of [root, path.join(root, 'src'), path.join(root, 'assets')]) {
  if (!fs.existsSync(directory)) continue;
  fs.watch(directory, (_event, filename) => {
    if (!filename || !/\.(html|css|js|json|png|jpe?g|svg|webp)$/i.test(String(filename))) return;
    clearTimeout(reloadTimer);
    reloadTimer = setTimeout(() => {
      for (const client of clients) client.write('event: reload\ndata: changed\n\n');
    }, 120);
  });
}

server.listen(port, host, () => console.log(`Cutting dev server: http://${host}:${port}/`));
