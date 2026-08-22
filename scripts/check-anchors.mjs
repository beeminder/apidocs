// Gate 2: every legacy inbound link and every internal link must resolve in the built site.
// Runs against dist/ after `astro build`. Keep this in CI: it is what fails if someone
// later renames a heading and quietly breaks a decade of external links into these docs.
import { readFileSync, existsSync } from 'node:fs';
import { LEGACY_ANCHORS } from '../src/legacy-anchors.js';

const page = p => `dist${p.endsWith('/') ? p + 'index.html' : p}`;
const idsOf = f => new Set([...readFileSync(f, 'utf8').matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
const errors = [];

// 1. legacy hash map -> real page, real anchor
for (const [anchor, target] of Object.entries(LEGACY_ANCHORS)) {
  const [path, frag] = target.split('#');
  const f = page(path);
  if (!existsSync(f)) { errors.push(`legacy #${anchor} -> ${target}: no such page`); continue; }
  if (frag && !idsOf(f).has(frag)) errors.push(`legacy #${anchor} -> ${target}: page has no id="${frag}"`);
}

// 2. every internal link in the built output
const PAGES = Object.values(LEGACY_ANCHORS).map(t => t.split('#')[0])
  .concat('/').filter((v, i, a) => a.indexOf(v) === i);
for (const p of PAGES) {
  const f = page(p);
  if (!existsSync(f)) continue;
  const html = readFileSync(f, 'utf8');
  const ids = idsOf(f);
  for (const m of html.matchAll(/href="(\/[^"#]*)?(#[^"]*)?"/g)) {
    const [, path, frag] = m;
    if (!path && frag && frag !== '#') {                    // same-page fragment
      if (!ids.has(frag.slice(1))) errors.push(`${p}: dead fragment ${frag}`);
      continue;
    }
    if (!path || path.startsWith('/_')) continue;           // assets
    const tf = page(path);
    if (!existsSync(tf)) { errors.push(`${p}: dead link ${path}`); continue; }
    if (frag && frag !== '#' && !idsOf(tf).has(frag.slice(1)))
      errors.push(`${p}: dead link ${path}${frag}`);
  }
}

if (errors.length) { console.log(`FAIL (${errors.length}):\n` + errors.join('\n')); process.exit(1); }
console.log(`PASS: ${Object.keys(LEGACY_ANCHORS).length} legacy anchors + all internal links resolve`);
