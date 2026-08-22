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
    let key = '(preamble)'; let sub = ''; let inFence = false;
    const fm = /^---\n([\s\S]*?)\n---\n/.exec(text);
    if (fm) {                                   // post-split page: its title IS the section
      key = (/^title:\s*(.*)$/m.exec(fm[1])?.[1] ?? key).trim();
      text = text.slice(fm[0].length);
    }
    for (const line of text.split('\n')) {
      const h1 = /^# (.+)$/.exec(line) ?? /^<h1 id="[^"]*">(.*?)<\/h1>$/.exec(line);
      const h2 = /^## (.+?)(?:\s*\{#[\w-]+\})?$/.exec(line) ?? /^<h2 id="[^"]*">(.*?)<\/h2>$/.exec(line);
      // h3+ also opens a bucket. Without it every "Attributes"/"HTTP Request"/"Parameters"/
      // "Returns" under one endpoint pools together, and a default swapped between two
      // parameters would leave the multiset identical and pass silently.
      const h3 = /^#{3,6} (.+?)(?:\s*\{#[\w-]+\})?$/.exec(line) ?? /^<h([3-6]) id="[^"]*">(.*?)<\/h\1>$/.exec(line);
      if (h1) { key = h1[1].trim(); sub = ''; continue; }  // the heading text names the bucket
      if (h2) { key = h2[1].trim(); sub = ''; continue; }
      if (h3) { sub = (h3[2] ?? h3[1]).trim(); continue; }
      // Prose is bucketed tightly (h3), so a sentence or a default cannot migrate between
      // Parameters and Returns unseen. Code samples are bucketed loosely (h2), because the
      // migration deliberately moved them out of the endpoint preamble into the subsection
      // they demonstrate -- a move that crosses h3 boundaries on purpose.
      const fence = /^\s*```/.test(line);
      if (fence) inFence = !inFence;
      add(fence || inFence ? key : (sub ? `${key} > ${sub}` : key), words(line));
    }
  }
  for (const [k, v] of buckets) buckets.set(k, v.sort());
  return buckets;
};

// Two markup transformations deliberately move words between buckets, both committed and
// described earlier on this branch: a "> Example authorization URL:" rail label became a
// code-block title, and the datapoints_count example listings became fenced code instead
// of loose paragraphs. Because fenced words bucket at h2 and prose at h3, each shows up
// here as a matched pair. They are listed exactly rather than loosening the gate, so any
// OTHER movement still fails.
const EXPECTED = [
  "+ [Client OAuth] Example URL: authorization",
  "- [Client OAuth > 2. Send your users to the Beeminder authorization URL] Example URL: authorization",
  "+ [Get information about a user] 1 1 1 1 1 1 1 1 1 12 12 13 14 14 15 15 16 16",
  "- [Get information about a user > Parameters] 1 1 1 1 1 1 1 1 1 12 12 13 14 14 15 15 16 16",
];

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
const unexpected = diffs.filter(d => !EXPECTED.includes(d));
const missing = EXPECTED.filter(e => !diffs.includes(e));
if (!unexpected.length && !missing.length) {
  console.log(`PASS: every section holds the same words (${EXPECTED.length / 2} declared markup moves)`);
  process.exit(0);
}
if (unexpected.length) console.log('\nUnexpected differences:\n' + unexpected.join('\n'));
if (missing.length) console.log('\nDeclared moves that no longer occur (stale whitelist):\n' + missing.join('\n'));
process.exit(1);
