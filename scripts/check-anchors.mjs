// Gate 2: every legacy inbound link and every internal link must resolve in the built site.
// Runs against dist/ after `astro build`. Keep this in CI: it is what fails if someone
// later renames a heading and quietly breaks a decade of external links into these docs.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { LEGACY_ANCHORS } from '../src/legacy-anchors.js';

const page = p => `dist${p.endsWith('/') ? p + 'index.html' : p}`;

// Count ids rather than collecting them into a Set: because remark-heading-id lets an
// author pin an arbitrary explicit id, two headings on one page can collide, and a browser
// would silently jump to whichever came first. A Set cannot see that.
const idCounts = f => {
  const counts = new Map();
  for (const m of readFileSync(f, 'utf8').matchAll(/\bid="([^"]+)"/g))
    counts.set(m[1], (counts.get(m[1]) ?? 0) + 1);
  return counts;
};
const idsOf = f => idCounts(f);
const errors = [];

// Every built page, discovered from dist/ -- NOT derived from LEGACY_ANCHORS. Pages that
// are not themselves legacy-anchor targets (/url-goal-creation/, /errors/) still contain
// internal links, and deriving the list from the anchor map skipped them entirely.
const builtPages = (dir = 'dist', base = '/') => {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('_') || e.name === 'pagefind') continue;
    if (e.isDirectory()) out.push(...builtPages(`${dir}/${e.name}`, `${base}${e.name}/`));
    else if (e.name === 'index.html') out.push(base);
  }
  return out;
};

// 1. legacy hash map -> real page, real anchor
for (const [anchor, target] of Object.entries(LEGACY_ANCHORS)) {
  const [path, frag] = target.split('#');
  const f = page(path);
  if (!existsSync(f)) { errors.push(`legacy #${anchor} -> ${target}: no such page`); continue; }
  if (frag && !idsOf(f).has(frag)) errors.push(`legacy #${anchor} -> ${target}: page has no id="${frag}"`);
}

// 2. every internal link on every built page, plus duplicate-id detection
const PAGES = builtPages();
for (const p of PAGES) {
  const f = page(p);
  const html = readFileSync(f, 'utf8');
  const ids = idCounts(f);

  for (const [id, n] of ids) if (n > 1) errors.push(`${p}: duplicate id="${id}" (${n} elements)`);

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
console.log(`PASS: ${Object.keys(LEGACY_ANCHORS).length} legacy anchors + all internal links on ${PAGES.length} pages resolve`);
