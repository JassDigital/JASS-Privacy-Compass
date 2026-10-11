const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const catalogue = require('../data/catalogue.json');

test('catalogue is non-empty and every entry has a unique id', () => {
  assert.ok(catalogue.length >= 25, `expected at least 25 entries, got ${catalogue.length}`);
  const ids = catalogue.map(x => x.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('each catalogue record has the required fields and HTTPS source links', () => {
  for (const item of catalogue) {
    for (const field of ['id','name','category','kind','platforms','hosting','account','encryption','summary','caveats','url','evidence','reviewStatus','reviewed']) {
      assert.ok(item[field] !== undefined && item[field] !== null && item[field] !== '', `${item.id} missing ${field}`);
    }
    assert.match(item.url, /^https:\/\//, `${item.id} official URL must use HTTPS`);
    assert.ok(Array.isArray(item.evidence) && item.evidence.length > 0, `${item.id} needs evidence links`);
    assert.ok(item.evidence.every(url => /^https:\/\//.test(url)), `${item.id} evidence URLs must use HTTPS`);
    assert.ok(Array.isArray(item.platforms) && item.platforms.length > 0);
  }
});

test('Electron security defaults are explicitly enabled', () => {
  const main = fs.readFileSync(path.join(__dirname, '../electron/main.cjs'), 'utf8');
  assert.match(main, /contextIsolation:\s*true/);
  assert.match(main, /nodeIntegration:\s*false/);
  assert.match(main, /sandbox:\s*true/);
  assert.match(main, /setWindowOpenHandler/);
});
