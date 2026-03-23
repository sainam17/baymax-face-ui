/**
 * set_face.js — CLI helper to push a face expression into the Electron app.
 *
 * Called by pi5_face_service.py:
 *   node scripts/set_face.js <expression>
 *
 * How it works:
 *   The Electron main process (main.js) listens for the 'set-expression' IPC
 *   event and executes setExpression() inside the renderer.  This script
 *   connects to the running Electron app via a local HTTP endpoint that
 *   main.js exposes on port 8768 (see below).
 *
 * You must add the tiny HTTP listener in main.js (see README / progress.md).
 *
 * Valid expressions (from index.html RobotFace.setExpression):
 *   idle | happy | thinking | scanning | talking | surprised | warning
 *
 * Emotion → expression mapping (Design.md §2.2):
 *   0 Normal    → idle
 *   1 Searching → scanning
 *   2 Happy     → happy
 *   3 Talking   → talking
 *   4 Thinking  → thinking
 */

'use strict';

const http = require('http');

const VALID_EXPRESSIONS = new Set([
  'idle', 'happy', 'thinking', 'scanning', 'talking', 'surprised', 'warning',
]);

const expression = process.argv[2];

if (!expression) {
  console.error('Usage: node set_face.js <expression>');
  process.exit(1);
}

if (!VALID_EXPRESSIONS.has(expression)) {
  console.error(`Unknown expression: "${expression}". Valid: ${[...VALID_EXPRESSIONS].join(', ')}`);
  process.exit(1);
}

// Post to the local IPC HTTP bridge that main.js exposes
const payload = JSON.stringify({ expression });

const options = {
  hostname: '127.0.0.1',
  port: 8768,            // Internal Electron IPC bridge port (see main.js)
  path: '/set-expression',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
  },
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log(`OK: expression="${expression}"`);
      process.exit(0);
    } else {
      console.error(`Error ${res.statusCode}: ${data}`);
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.error(`Failed to reach Electron IPC bridge: ${err.message}`);
  console.error('Make sure the Electron app is running and the IPC bridge is enabled in main.js');
  process.exit(1);
});

req.write(payload);
req.end();
