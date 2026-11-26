import assert from "node:assert/strict";
import { test } from "node:test";
import {
  describeDisallowed,
  disallowedNodes,
  type MarkdownNode,
} from "./entry-description.ts";

const text = { type: "text" };

test("disallowedNodes accepts paragraphs, lists, bold, italic and links", () => {
  const root: MarkdownNode = {
    type: "root",
    children: [
      {
        type: "paragraph",
        children: [
          text,
          { type: "strong", children: [text] },
          { type: "emphasis", children: [text] },
          { type: "link", children: [text] },
          { type: "break" },
          { type: "linkReference", children: [text] },
        ],
      },
      { type: "definition" },
      {
        type: "list",
        ordered: false,
        children: [
          {
            type: "listItem",
            children: [{ type: "paragraph", children: [text] }],
          },
        ],
      },
    ],
  };
  assert.deepEqual(disallowedNodes(root), []);
});

test("disallowedNodes finds anything else, at any depth", () => {
  const heading = { type: "heading", children: [text] };
  const code = { type: "inlineCode" };
  const component = { type: "mdxJsxFlowElement" };
  const root: MarkdownNode = {
    type: "root",
    children: [
      heading,
      { type: "paragraph", children: [text, code] },
      { type: "list", children: [{ type: "listItem", children: [component] }] },
    ],
  };
  assert.deepEqual(disallowedNodes(root), [heading, code, component]);
});

test("disallowedNodes rejects a numbered list", () => {
  const numbered = {
    type: "list",
    ordered: true,
    children: [{ type: "listItem", children: [text] }],
  };
  assert.deepEqual(disallowedNodes({ type: "root", children: [numbered] }), [
    numbered,
  ]);
});

test("disallowedNodes reports a disallowed node once, not what's inside it", () => {
  const quote = {
    type: "blockquote",
    children: [{ type: "paragraph", children: [{ type: "image" }] }],
  };
  assert.deepEqual(disallowedNodes({ type: "root", children: [quote] }), [
    quote,
  ]);
});

test("describeDisallowed names the file and each node found", () => {
  assert.equal(
    describeDisallowed(
      [
        { type: "heading" },
        { type: "list", ordered: true },
        { type: "mdxJsxTextElement" },
      ],
      "src/content/work/vesu.mdx",
    ),
    "src/content/work/vesu.mdx: a description holds paragraphs, bulleted lists, bold, italic and links only. Found: heading, numbered list, mdxJsxTextElement.",
  );
});
