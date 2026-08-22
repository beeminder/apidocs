// Fails when an AI-agent-co-authored commit changes the documentation text.
//
// Policy: only humans write the API reference. Everything under src/content/docs is
// user-facing copy -- prose, parameter descriptions, defaults, and the example requests
// and responses readers copy into their own code. An agent may restructure the site
// around those docs (config, build, styles, the check scripts); it may not author or edit
// what the docs say.
//
// Scope = commits on this branch that are not on the base branch (<base>..HEAD), so merged
// history is never re-judged and this only polices new commits in a PR. It is expected to
// fail on the PR that first migrates the docs into this layout -- that bulk move is
// agent-authored, and a human has to take responsibility for it explicitly.
//
// KNOWN AND ACCEPTED LIMIT: a commit with no Co-authored-by trailer and a human author is
// indistinguishable from human work, and `git commit --amend` strips the trailer. That is
// the designed escape hatch -- re-authoring is how a human takes responsibility for copy
// an agent drafted. This check proves someone chose to sign for the wording, not that they
// read it. It raises the floor; it is not a sandbox.
//
// Mirrors beeminder/blog's check:strings, which guards that repo's i18n catalog the same
// way. Keep this in sync if that one changes.
import { spawnSync } from 'node:child_process';

const git = args => {
  const r = spawnSync('git', args, { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`git ${args.join(' ')} failed:\n${r.stderr}`);
  return r.stdout;
};

const base = process.env.DOCS_CHECK_BASE
  || (process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : 'origin/master');

// Content pages, plus the sidebar labels and titles in astro.config.mjs, which duplicate
// page copy and would otherwise be freely editable.
const isProtected = file =>
  (file.startsWith('src/content/docs/') && /\.(md|mdx|mdoc|markdown)$/.test(file))
  || file === 'astro.config.mjs';

// Only `label:` and `title:` values matter in the config; the rest is machinery. Matched
// anywhere in the line, since these often sit inline inside an array of objects.
const lineMatters = (file, content) =>
  file !== 'astro.config.mjs' || /\b(label|title):/.test(content);

// Deliberately an allow-list, not a deny-list of known agents. Any Co-authored-by trailer
// is treated as agent-authored unless the co-author is a known human, because an unknown
// tool passing silently is the expensive failure and a spurious block is only annoying.
// Add real human co-authors here (pair programming, patch attribution).
const HUMAN_COAUTHORS = [
  // /^Some Person <some\.person@example\.com>$/i,
];

// Matched against the AUTHOR's email only, never a display name: contributors are really
// called Claude and Devin, and matching free text blocks them from their own repo.
const AGENT_AUTHOR_EMAIL = [
  /@anthropic\.com$/i, /@openai\.com$/i, /@cursor\.(com|sh)$/i, /@devin\.ai$/i,
  /@cognition(-labs)?\.ai$/i, /^copilot@/i, /^\d+\+copilot\b/i, /@google\.com$/i,
];

const isAgentAuthored = (message, authorEmail) => {
  const trailers = [...message.matchAll(/^\s*co-authored-by:\s*(.+)$/gim)].map(m => (m[1] ?? '').trim());
  if (trailers.some(t => !HUMAN_COAUTHORS.some(h => h.test(t)))) return true;
  return AGENT_AUTHOR_EMAIL.some(p => p.test(authorEmail));
};

// A changed line is documentation text unless it is purely structural. Markdown carries its
// meaning in the text itself, so the exemption list is deliberately short. Note "---" is NOT
// exempt: it is also a thematic break, and exempting it by content would let a real page
// -structure change through. Frontmatter delimiters only move when a file is created or
// deleted, which the title: line flags anyway.
const isStructuralOnly = content => {
  const t = content.trim();
  if (t === '') return true;
  if (/^```\S*$/.test(t)) return true;                       // a fence with title= IS copy
  if (/^<\/?(?:br|aside|div|p)\b[^>]*>$/i.test(t)) return true;
  return false;
};

try {
  git(['rev-parse', '--verify', base]);
} catch {
  console.error(`check:docs-authorship: base ref '${base}' not found.\n`
    + 'Fetch the base branch first, or set DOCS_CHECK_BASE (e.g. origin/master).');
  process.exit(2);
}

// Merge commits are INCLUDED. Excluding them leaves a real bypass: edits made while
// resolving a conflict, or slipped into a --no-commit merge, live only in the merge commit
// and appear in no other. They are diffed against their first parent.
const shas = git(['rev-list', `${base}..HEAD`]).split('\n').map(s => s.trim()).filter(Boolean);
const violations = [];

for (const sha of shas) {
  const message = git(['show', '-s', '--format=%B', sha]);
  const authorEmail = git(['show', '-s', '--format=%ae', sha]).trim();
  if (!isAgentAuthored(message, authorEmail)) continue;

  // --name-status -M so a pure rename (R100) can be skipped rather than reported as every
  // line of the file being deleted and re-added. Pathspec-limiting the later `git show`
  // defeats rename detection, so the decision has to be made here, from the status.
  const files = [];
  for (const row of git(['diff-tree', '--no-commit-id', '--name-status', '-r', '-M', '-m', '--first-parent', sha]).split('\n')) {
    const cols = row.split('\t');
    if (cols.length < 2) continue;
    const [status, ...paths] = cols;
    if (status === 'R100') continue;                 // pure rename: no wording changed
    const path = paths[paths.length - 1];            // for a rename, the destination
    if (isProtected(path)) files.push(path);
  }

  for (const file of new Set(files)) {
    const patch = git(['show', '--format=', '--unified=0', '-M', '-m', '--first-parent', sha, '--', file]);
    for (const line of patch.split('\n')) {
      if (line.startsWith('+++') || line.startsWith('---') || line.startsWith('@@')) continue;
      if (!line.startsWith('+') && !line.startsWith('-')) continue;
      const content = line.slice(1);
      if (isStructuralOnly(content) || !lineMatters(file, content)) continue;
      violations.push(`${sha.slice(0, 9)} ${file}: ${line.trim()}`);
    }
  }
}

if (violations.length) {
  console.error('check:docs-authorship: agent-co-authored commit(s) changed the documentation text.\n'
    + 'Only humans write the API reference. An agent may change the site around the docs,\n'
    + 'not what they say. Re-author the commit under a human identity after reviewing the\n'
    + 'wording, or have a maintainer merge deliberately.\n');
  for (const v of violations.slice(0, 25)) console.error('  ' + v);
  if (violations.length > 25) console.error(`  ...and ${violations.length - 25} more.`);
  process.exit(1);
}

console.log('check:docs-authorship: no agent-authored changes to the documentation text.');
