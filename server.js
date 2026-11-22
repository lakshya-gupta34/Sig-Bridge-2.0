/**
 * SignBridge - Advanced Indian Sign Language (ISL) <-> English & Hindi Platform
 * Core Node.js HTTP Server & Mock API Service
 * 
 * Features:
 * - Zero external npm dependencies required (uses standard Node.js 'http', 'fs', 'path', 'url')
 * - Serves static frontend assets with accurate MIME streaming
 * - REST API endpoints for ISL grammar translation & health check
 * - Automatic port fallback if port 3000 is occupied
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const PUBLIC_DIR = __dirname;

// MIME types dictionary for static file serving
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.woff2': 'font/woff2',
  '.wasm': 'application/wasm'
};

// Simple in-memory translation corpus for API fallback
const SAMPLE_GLOSS_MAP = {
  "hello": { isl_gloss: "NAMASTE", hindi: "नमस्ते", english: "Hello" },
  "thank you": { isl_gloss: "DHANYAVAAD", hindi: "धन्यवाद", english: "Thank You" },
  "where is hospital": { isl_gloss: "HOSPITAL WHERE", hindi: "अस्पताल कहाँ है?", english: "Where is the hospital?" },
  "i need help": { isl_gloss: "ME HELP NEED", hindi: "मुझे मदद चाहिए", english: "I need help" },
  "i want water": { isl_gloss: "ME WATER WANT", hindi: "मुझे पानी चाहिए", english: "I want water" },
  "call doctor": { isl_gloss: "DOCTOR CALL QUICK", hindi: "डॉक्टर को बुलाओ", english: "Call a doctor" }
};

/**
 * Handle API Requests
 */
function handleApi(req, res, parsedUrl) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // GET /api/health
  if (parsedUrl.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'SignBridge Core Server',
      version: '1.0.0',
      uptime: process.uptime(),
      standards: 'ISLRTC (Indian Sign Language Research and Training Centre) Aligned',
      languagesSupported: ['ISL', 'English', 'Hindi (Devanagari)']
    }, null, 2));
    return;
  }

  // POST /api/translate-text
  if (parsedUrl.pathname === '/api/translate-text' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const text = (payload.text || '').trim().toLowerCase();
        const sourceLang = payload.sourceLang || 'en';

        // Check dictionary lookup or rule-based fallback
        const match = SAMPLE_GLOSS_MAP[text];
        const responseData = match ? {
          query: payload.text,
          sourceLang,
          islGloss: match.isl_gloss,
          english: match.english,
          hindi: match.hindi,
          tokens: match.isl_gloss.split(' '),
          grammarNotes: 'ISL SOV structure with copula verb dropped'
        } : {
          query: payload.text,
          sourceLang,
          islGloss: text.toUpperCase().replace(/[?.,!]/g, ''),
          english: payload.text,
          hindi: 'अनुवाद प्रक्रियाधीन',
          tokens: text.toUpperCase().split(/\s+/),
          grammarNotes: 'Dynamic tokenization'
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseData));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // 404 for unknown API
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'API endpoint not found' }));
}

/**
 * Main HTTP Request Router
 */
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // Route API endpoints
  if (parsedUrl.pathname.startsWith('/api/')) {
    handleApi(req, res, parsedUrl);
    return;
  }

  // Static File Serving
  let safePath = path.normalize(decodeURIComponent(parsedUrl.pathname));
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, safePath);

  // Security check: ensure path stays within PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden: Access Denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback: If requesting HTML path or non-existent route, fallback to index.html
      const indexPath = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found: index.html not found');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Stream the file with proper caching headers
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

/**
 * Start Server with Port Auto-fallback
 */
function startServer(port) {
  server.listen(port, () => {
    console.log(`\n========================================================`);
    console.log(`  SignBridge - Indian Sign Language Translator v1.0.0`);
    console.log(`  Bilingual: English <---> Indian Sign Language <---> Hindi`);
    console.log(`========================================================`);
    console.log(`  [OK] Server running at: http://localhost:${port}`);
    console.log(`  [OK] API Health Check:  http://localhost:${port}/api/health`);
    console.log(`  [OK] Open your browser and navigate to the link above.`);
    console.log(`========================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[WARN] Port ${port} is in use, attempting port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('[ERROR] Server startup error:', err);
    }
  });
}

startServer(DEFAULT_PORT);
