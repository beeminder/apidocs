// Gate 1: prove the migration moved words, it did not rewrite them.
//
// Code samples were deliberately moved out of each section's preamble down into the
// subsection they demonstrate -- Slate floated them in a right-hand rail, so their
// position in the source was rail order, not reading order. Because that reordering is
// intentional, this gate does not compare word order across a whole file. It buckets
// words by their enclosing section and compares each bucket as a sorted multiset, which
// still proves nothing was added, dropped, mangled, or moved between sections.
import { readFileSync, existsSync } from 'node:fs';

const OLD = process.env.PREMIGRATION_DIR
  ? ['index.html.md', '_url_goal_creation.md', '_errors.md'].map(f => `${process.env.PREMIGRATION_DIR}/${f}`)
  : ['source/index.html.md', 'source/includes/_url_goal_creation.md', 'source/includes/_errors.md'];
const NEW = ['index', 'authentication', 'user', 'goal', 'datapoint', 'charge', 'webhooks',
             'url-goal-creation', 'errors'].map(s => `src/content/docs/${s}.md`);

if (!OLD.every(existsSync)) {
  console.log('skip: pre-migration sources deleted; gate 1 was a one-time migration proof');
  process.exit(0);
}

// One line -> its words, with markup the migration legitimately changed removed.
const words = line => line
  .replace(/^<h([2-6]) id="[^"]*">(.*?)<\/h\1>$/, '$2')   // raw HTML heading -> its text
  .replace(/^#{2,6} (.*?)\s*\{#[A-Za-z0-9_-]+\}$/, '$1')  // "## text {#id}" -> its text
  .replace(/^#{2,6} /, '')
  .replace(/^> ?/, '')                                    // blockquote marker: layout, not words
  .replace(/<br\s*\/?>/gi, '')                            // <br>: presentational
  // Fence delimiters are structure. Keep any title="...", which is where the old
  // "> Examples" labels now live. Code *inside* fences still counts.
  .replace(/^\s*```.*$/, m => /title="([^"]*)"/.exec(m)?.[1] ?? '')
  // Link targets are rewritten by design (one page -> many). \s* tolerates a stray space.
  .replace(/\]\(#[a-zA-Z0-9_-]+\s*\)/g, '](LINK)')
  .replace(/\]\(\/[a-z-]+\/(#[a-zA-Z0-9_-]+)?\s*\)/g, '](LINK)')
  .split(/\s+/).filter(Boolean);

// Bucket a file's words by section. A section starts at an h1 (which became a page title
// when the single page was split) or an h2, in either markdown or raw-HTML form.
const sectioned = files => {
  const buckets = new Map();
  const add = (k, w) => w.length && buckets.set(k, (buckets.get(k) ?? []).concat(w));
  for (const f of files) {
    let text = readFileSync(f, 'utf8');
    let key = '(preamble)';
    const fm = /^---\n([\s\S]*?)\n---\n/.exec(text);
    if (fm) {                                   // post-split page: its title IS the section
      key = (/^title:\s*(.*)$/m.exec(fm[1]) ?? [, key])[1].trim();
      text = text.slice(fm[0].length);
    }
    for (const line of text.split('\n')) {
      const h1 = /^# (.+)$/.exec(line) ?? /^<h1 id="[^"]*">(.*?)<\/h1>$/.exec(line);
      const h2 = /^## (.+?)(?:\s*\{#[\w-]+\})?$/.exec(line) ?? /^<h2 id="[^"]*">(.*?)<\/h2>$/.exec(line);
      if (h1) { key = h1[1].trim(); continue; }  // the heading text itself names the bucket
      if (h2) { key = h2[1].trim(); continue; }
      add(key, words(line));
    }
  }
  for (const [k, v] of buckets) buckets.set(k, v.sort());
  return buckets;
};

const A = sectioned(OLD), B = sectioned(NEW);
const total = m => [...m.values()].reduce((n, v) => n + v.length, 0);
const diffs = [];
for (const k of new Set([...A.keys(), ...B.keys()])) {
  const x = A.get(k) ?? [], y = B.get(k) ?? [];
  if (x.join(' ') === y.join(' ')) continue;
  const only = (p, q) => p.filter(w => { const i = q.indexOf(w); if (i < 0) return true; q.splice(i, 1); return false; });
  const lost = only(x, [...y]), gained = only(y, [...x]);
  if (lost.length) diffs.push(`- [${k}] ${lost.join(' ')}`);
  if (gained.length) diffs.push(`+ [${k}] ${gained.join(' ')}`);
}

console.log(`old: ${total(A)} words in ${A.size} sections   new: ${total(B)} words in ${B.size} sections`);
if (!diffs.length) { console.log('PASS: every section holds exactly the same words'); process.exit(0); }
console.log('\nDifferences:\n' + diffs.join('\n'));
process.exit(1);
