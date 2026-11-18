import { satteri } from "@astrojs/markdown-satteri";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
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
  // Markdown images get a responsive srcset, with sizes from their own
  // dimensions; components set their own.
  image: {
    layout: "constrained",
    responsiveStyles: true,
  },
  integrations: [
    mdx(),
    sitemap({
      // The 404 page is served for missing addresses, not found by crawling.
      filter: (page) => new URL(page).pathname !== "/404",
      namespaces: { news: false, xhtml: false, image: false, video: false },
    }),
  ],
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Instrument Sans",
      cssVariable: "--font-sans",
      weights: ["400 600"],
      styles: ["normal"],
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
      // Hides the text briefly while the font gets ready, then allows a swap
      // for a few seconds: a cached font (moving between pages) draws without
      // the fallback's shift, and a first visit still gets it.
      display: "fallback",
    },
  ],
});
