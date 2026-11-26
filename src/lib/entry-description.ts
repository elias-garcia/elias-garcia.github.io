// An entry's description holds paragraphs, bulleted lists, bold, italic and
// links, nothing else (DESIGN.md, Entry): no headings, code, images, quotes, HTML or
// components. Checked on the parsed Markdown, so it can't be got around by
// writing the same thing another way.
const allowed = new Set([
  "root",
  "paragraph",
  "text",
  "break",
  "strong",
  "emphasis",
  "link",
  // A link written [text][name], with its address defined elsewhere.
  "linkReference",
  "definition",
  "list",
  "listItem",
]);

export type MarkdownNode = {
  readonly type: string;
  // On a list: numbered, which the design doesn't draw.
  readonly ordered?: boolean | null | undefined;
  readonly children?: readonly MarkdownNode[];
};

// Every node that isn't allowed, in reading order. What's inside one isn't
// reported again.
export function disallowedNodes(node: MarkdownNode): MarkdownNode[] {
  if (!allowed.has(node.type) || node.ordered === true) {
    return [node];
  }
  return (node.children ?? []).flatMap(disallowedNodes);
}

export function describeDisallowed(
  nodes: readonly MarkdownNode[],
  file: string,
): string {
  const found = nodes
    .map(({ type, ordered }) => (ordered === true ? "numbered list" : type))
    .join(", ");
  return `${file}: a description holds paragraphs, bulleted lists, bold, italic and links only. Found: ${found}.`;
}
