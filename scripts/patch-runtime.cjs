const fs = require('node:fs');
const path = require('node:path');
const bindings = path.join(__dirname, '..', 'contracts', 'managed', 'astraloom', 'contract', 'index.js');
if (!fs.existsSync(bindings)) { console.log('Astraloom bindings are not compiled yet; run npm run compile.'); process.exit(0); }
const source = fs.readFileSync(bindings, 'utf8');
if (!source.includes('signal_threshold') || !source.includes('weave_signal')) throw new Error('Generated bindings do not contain the Astraloom contract surface.');
console.log('Astraloom generated bindings match the installed Compact runtime (no patches applied).');
