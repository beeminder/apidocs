// Fails when an AI-agent-co-authored commit changes the documentation text.
//
// Policy: only humans write the API reference. Everything under src/content/docs is
// user-facing copy -- prose, parameter descriptions, defaults, and the example requests
// and responses readers copy into their own code. An agent may restructure the site
// around those docs (config, build, styles, the check scripts); it may not author or edit
// what the docs say.
//
// "Agent-authored" = the commit's author identity or any `Co-authored-by:` trailer matches
// a known AI-agent signature. This is the trailer Claude Code and similar tools write.
//
// Scope = commits on this branch that are not on the base branch (<base>..HEAD), so merged
// history is never re-judged and this only polices new commits in a PR. It is expected to
// fail on the PR that first migrates the docs into this layout -- that bulk move is
// agent-authored, and a human has to take responsibility for it explicitly.
//
// Mirrors beeminder/blog's check:strings, which guards that repo's i18n catalog the same
// way. Keep the agent patterns and base resolution in sync if either changes.
import { spawnSync } from 'node:child_process';

const git = args => {
  const r = spawnSync('git', args, { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`git ${args.join(' ')} failed:\n${r.stderr}`);
  return r.stdout;
};

const base = process.env.DOCS_CHECK_BASE
  || (process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : 'origin/master');

const isProtected = file => file.startsWith('src/content/docs/') && file.endsWith('.md');

const AGENT_PATTERNS = [
  /anthropic/i, /\bclaude\b/i, /\bcopilot\b/i, /\bcursor\b/i, /\bdevin\b/i,
  /\baider\b/i, /\bchatgpt\b/i, /\bopenai\b/i, /\bcodex\b/i,
];

const isAgentAuthored = (message, author) => {
  const trailers = [...message.matchAll(/^\s*co-authored-by:\s*(.+)$/gim)].map(m => (m[1] ?? '').trim());
  return [author, ...trailers].some(id => AGENT_PATTERNS.some(p => p.test(id)));
};

// A changed line is documentation text unless it is purely structural. Markdown carries its
// meaning in the text itself, so the exemption list is deliberately short: blank lines,
// fence delimiters that carry no title, frontmatter delimiters, and standalone HTML tags
// that render nothing on their own.
const isStructuralOnly = content => {
  const t = content.trim();
  if (t === '') return true;
  if (t === '---') return true;
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

const shas = git(['rev-list', '--no-merges', `${base}..HEAD`]).split('\n').map(s => s.trim()).filter(Boolean);
const violations = [];

for (const sha of shas) {
  const message = git(['show', '-s', '--format=%B', sha]);
  const author = git(['show', '-s', '--format=%an <%ae>', sha]).trim();
  if (!isAgentAuthored(message, author)) continue;

  const files = git(['diff-tree', '--no-commit-id', '--name-only', '-r', sha])
    .split('\n').map(s => s.trim()).filter(isProtected);

  for (const file of files) {
    const patch = git(['show', '--format=', '--unified=0', sha, '--', file]);
    for (const line of patch.split('\n')) {
      if (line.startsWith('+++') || line.startsWith('---') || line.startsWith('@@')) continue;
      if (!line.startsWith('+') && !line.startsWith('-')) continue;
      if (!isStructuralOnly(line.slice(1))) violations.push(`${sha.slice(0, 9)} ${file}: ${line.trim()}`);
    }
  }
}

if (violations.length) {
  console.error('check:docs-authorship: agent-co-authored commit(s) changed the documentation text.\n'
    + 'Only humans write the API reference. An agent may change the site around the docs,\n'
    + 'not what they say. Re-author the commit under a human identity after reviewing it,\n'
    + 'or have a maintainer merge deliberately.\n');
  for (const v of violations.slice(0, 25)) console.error('  ' + v);
  if (violations.length > 25) console.error(`  ...and ${violations.length - 25} more.`);
  process.exit(1);
}

console.log('check:docs-authorship: no agent-authored changes to the documentation text.');
