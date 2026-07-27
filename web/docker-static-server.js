const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || '3000', 10);
const API_TARGET = process.env.API_TARGET || 'http://server:8080';
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function sendFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, { 'Content-Type': type });
  fs.createReadStream(filePath).pipe(res);
}

async function proxyApi(req, res) {
  const targetUrl = new URL(req.url, API_TARGET);
  const headers = { ...req.headers, host: targetUrl.host };

  const requestInit = {
    method: req.method,
    headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : req,
    duplex: 'half',
  };

  const upstream = await fetch(targetUrl, requestInit);

  res.writeHead(upstream.status, Object.fromEntries(upstream.headers.entries()));

  if (upstream.body) {
    for await (const chunk of upstream.body) {
      res.write(chunk);
    }
  }

  res.end();
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith('/api/')) {
      await proxyApi(req, res);
      return;
    }

    const requestPath = req.url === '/' ? '/index.html' : req.url;
    const safePath = path.normalize(decodeURIComponent(requestPath)).replace(/^(\.\.[\\/])+/, '');
    const filePath = path.join(DIST_DIR, safePath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      sendFile(filePath, res);
      return;
    }

    sendFile(path.join(DIST_DIR, 'index.html'), res);
  } catch (error) {
    res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Bad gateway', details: error.message }));
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Static server started on http://0.0.0.0:${PORT}`);
});
