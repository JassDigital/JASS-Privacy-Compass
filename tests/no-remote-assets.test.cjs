const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
test('UI styles do not fetch remote fonts or assets', () => {
  const css = fs.readFileSync(path.join(__dirname, '../src/styles.css'), 'utf8');
  assert.doesNotMatch(css, /@import\s+url\(['"]?https?:/i);
  assert.doesNotMatch(css, /url\(['"]?https?:/i);
});
