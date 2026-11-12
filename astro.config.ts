import { satteri } from "@astrojs/markdown-satteri";
import mdx from "@astrojs/mdx";
import { transformerNotationHighlight } from "@shikijs/transformers";
import { defineConfig, fontProviders } from "astro/config";
import { mdastReadingTimePlugin } from "./src/lib/mdast-reading-time.ts";
import { indigoMinimal } from "./src/lib/shiki-theme.ts";

export default defineConfig({
  site: "https://eliasgarcia.dev",
  trailingSlash: "never",
  build: {
    format: "file",
  },
  markdown: {
    processor: satteri({
      mdastPlugins: [mdastReadingTimePlugin],
      // Straight quotes, as typed (DESIGN.md §5).
      features: {
        smartPunctuation: { quotes: false, dashes: true, ellipses: true },
      },
    }),
    shikiConfig: {
      theme: indigoMinimal,
      transformers: [transformerNotationHighlight()],
    },
  },
  // Markdown images get a responsive srcset (their sizes: PLAN.md, Open
  // decisions); components set their own.
  image: {
    layout: "constrained",
    responsiveStyles: true,
  },
  integrations: [mdx()],
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Instrument Sans",
      cssVariable: "--font-sans",
      weights: ["400 600"],
      styles: ["normal"],
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
    },
  ],
});
