// Lets a markdown heading keep an explicit id:  ## Get information about a goal {#getgoal}
// The docs' endpoint headings were raw HTML (<h2 id="getgoal">) under Slate, which markdown
// treats as an opaque HTML node -- so they never became headings and never reached the
// table of contents. Real headings with a pinned id keep the frozen anchors AND the TOC.
export function remarkHeadingId() {
  return tree => visit(tree);
}
function visit(node) {
  if (node.type === 'heading') {
    const last = node.children[node.children.length - 1];
    if (last?.type === 'text') {
      const m = /^(.*?)\s*\{#([A-Za-z0-9_-]+)\}\s*$/s.exec(last.value);
      if (m) {
        last.value = m[1];
        (node.data ??= {}).hProperties = { ...(node.data.hProperties ?? {}), id: m[2] };
        if (last.value === '') node.children.pop();
      }
    }
  }
  for (const child of node.children ?? []) visit(child);
}
