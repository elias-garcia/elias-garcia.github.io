import type { ThemeRegistration } from "shiki";

// The minimal indigo syntax theme (DESIGN.md §3, Syntax theme). Colours are
// the site's tokens, so code follows light and dark mode with the rest of the
// site. Anything not matched below is --text-2. The muted colour of comments
// and punctuation is --code-muted when a code block sets it (CodeBlock, on a
// highlighted line), --text-3 otherwise.
export const indigoMinimal: ThemeRegistration = {
  name: "indigo-minimal",
  type: "light",
  colors: {
    "editor.foreground": "var(--text-2)",
    "editor.background": "transparent",
  },
  tokenColors: [
    {
      scope: ["keyword", "storage", "keyword.control.at-rule"],
      settings: { foreground: "var(--accent)" },
    },
    {
      scope: [
        "string",
        "constant.numeric",
        "constant.language",
        "constant.other.color",
        "support.constant.property-value",
        "keyword.other.unit",
        "punctuation.definition.string",
      ],
      settings: { foreground: "var(--code-literal)" },
    },
    {
      scope: [
        "entity.name.function",
        "entity.name.command",
        "support.function",
        "entity.name.tag",
        "entity.other.attribute-name",
        "support.type.property-name",
        "meta.object-literal.key",
        "variable.other.property",
      ],
      settings: { foreground: "var(--text)" },
    },
    {
      scope: [
        "punctuation",
        "meta.brace",
        "keyword.operator",
        "storage.type.function.arrow",
      ],
      settings: { foreground: "var(--code-muted, var(--text-3))" },
    },
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: {
        foreground: "var(--code-muted, var(--text-3))",
        fontStyle: "italic",
      },
    },
    {
      // Shell arguments stay plain.
      scope: ["source.shell string.unquoted", "source.shell constant"],
      settings: { foreground: "var(--text-2)" },
    },
  ],
};
