// Gate 1: prove the migration moved words, it did not rewrite them.
// Normalises the pre-migration Slate sources and the post-migration Starlight pages
// to a bare word stream and diffs them. Must be empty apart from the whitelist below.
import { readFileSync, existsSync } from 'node:fs';

const OLD = (process.env.PREMIGRATION_DIR ? ['index.html.md','_url_goal_creation.md','_errors.md'].map(f => `${process.env.PREMIGRATION_DIR}/${f}`) : ['source/index.html.md', 'source/includes/_url_goal_creation.md', 'source/includes/_errors.md']);
const NEW = ['index', 'authentication', 'user', 'goal', 'datapoint', 'charge', 'webhooks',
             'url-goal-creation', 'errors'].map(s => `src/content/docs/${s}.md`);

if (!OLD.every(existsSync)) {
  console.log('skip: pre-migration sources deleted; gate 1 was a one-time migration proof');
  process.exit(0);
}

const words = (text) => text
  .replace(/^---\n[\s\S]*?\n---\n/, '')                 // frontmatter
  .split('\n')
  .filter(l => !/^<h1 id="[^"]*">.*<\/h1>$/.test(l))    // h1s that became frontmatter titles
  .filter(l => !/^# /.test(l))                          // markdown h1s, ditto
  // Heading syntax changed (raw HTML <h2 id="x"> -> "## text {#x}") so the endpoint
  // headings reach the table of contents. Reduce both forms to their text.
  .map(l => l.replace(/^<h([2-6]) id="[^"]*">(.*?)<\/h\1>$/, '$2')
             .replace(/^#{2,6} (.*?)\s*\{#[A-Za-z0-9_-]+\}$/, '$1'))
  .map(l => l.replace(/^> ?/, ''))                      // blockquote markers: quoting is layout, not words
  .map(l => l.replace(/<br\s*\/?>/gi, ''))               // <br> is presentational, same as a fence marker
  // Fence delimiters are structure, not words. Keep any title="..." text, since that is
  // where the old "> Examples" labels now live. Code *inside* fences still counts.
  .map(l => /^\s*```/.test(l) ? (/title="([^"]*)"/.exec(l)?.[1] ?? '') : l)
  .join('\n')
  // Link targets are rewritten by design (single page -> many); collapse both forms to a
  // token so the gate compares words, not hrefs. \s* tolerates a stray space in the source.
  .replace(/\]\(#[a-zA-Z0-9_-]+\s*\)/g, '](LINK)')
  .replace(/\]\(\/[a-z-]+\/(#[a-zA-Z0-9_-]+)?\s*\)/g, '](LINK)')
  .split(/\s+/).filter(Boolean);

const a = OLD.flatMap(f => words(readFileSync(f, 'utf8')));
const b = NEW.flatMap(f => words(readFileSync(f, 'utf8')));

// Whitelist: words that legitimately left, in the order they appear.
// - the four Slate toc_footers and language_tabs live in frontmatter (already stripped)
// - the "Docs powered by Slate" link was dropped by decision
const diffs = [];
let i = 0, j = 0;
while (i < a.length || j < b.length) {
  if (a[i] === b[j]) { i++; j++; continue; }
  // resync: look ahead a short window on both sides
  let k = 1, done = false;
  for (; k < 40 && !done; k++) {
    if (a[i + k] === b[j]) { diffs.push(`- ${a.slice(i, i + k).join(' ')}`); i += k; done = true; }
    else if (a[i] === b[j + k]) { diffs.push(`+ ${b.slice(j, j + k).join(' ')}`); j += k; done = true; }
  }
  if (!done) { diffs.push(`! diverged at old[${i}] "${a.slice(i, i + 8).join(' ')}" / new[${j}] "${b.slice(j, j + 8).join(' ')}"`); break; }
}

console.log(`old: ${a.length} words   new: ${b.length} words`);
if (!diffs.length) { console.log('PASS: word streams identical'); process.exit(0); }
console.log('\nDifferences:\n' + diffs.join('\n'));
process.exit(1);
