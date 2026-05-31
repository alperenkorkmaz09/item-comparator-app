const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3000;

const DESKTOP_PATH = path.join(os.homedir(), 'Desktop');
const BACKUP_FILENAME = 'comparator_backup.json';
const BACKUP_FILEPATH = path.join(DESKTOP_PATH, BACKUP_FILENAME);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  if (req.method === 'POST' && req.url === '/api/export') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        JSON.parse(body);

        fs.writeFile(BACKUP_FILEPATH, body, 'utf-8', err => {
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

          if (err) {
            console.error('Export error:', err);
            res.end(JSON.stringify({ success: false, error: err.message }));
            return;
          }

          console.log(`Database exported to: ${BACKUP_FILEPATH}`);
          res.end(JSON.stringify({ success: true, path: BACKUP_FILEPATH }));
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON data' }));
      }
    });

    return;
  }

  if (req.method === 'GET' && req.url === '/api/import') {
    fs.readFile(BACKUP_FILEPATH, 'utf-8', (err, data) => {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

      if (err) {
        const error =
          err.code === 'ENOENT'
            ? `"${BACKUP_FILENAME}" was not found on the desktop. Export the database first.`
            : err.message;

        res.end(JSON.stringify({ success: false, error }));
        return;
      }

      try {
        const parsed = JSON.parse(data);

        if (parsed && parsed.config && Array.isArray(parsed.items)) {
          console.log(`Database imported from: ${BACKUP_FILEPATH}`);
          res.end(JSON.stringify({ success: true, data: parsed }));
          return;
        }

        res.end(JSON.stringify({
          success: false,
          error: 'The file is valid JSON, but it does not have the expected structure (config + items required).',
        }));
      } catch (e) {
        res.end(JSON.stringify({ success: false, error: 'The file is not valid JSON.' }));
      }
    });

    return;
  }

  let filePath = '.' + decodeURIComponent(req.url.split('?')[0]);

  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
        return;
      }

      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`Server Error: ${error.code}`);
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content, 'utf-8');
  });
});

server.listen(PORT, () => {
  console.log('==================================================');
  console.log('Item Comparator Server is running!');
  console.log(`Access locally: http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
  console.log(`Backup location: ${BACKUP_FILEPATH}`);
  console.log('==================================================');
});
