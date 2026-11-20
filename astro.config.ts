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
  // Hovering or focusing a link to another page of the site loads it ahead
  // of the click. Downloads and links that open in a new tab opt out.
  prefetch: { prefetchAll: true },
  // Only this site's own scripts and styles run: Astro adds the hashes of
  // the ones it processes to a <meta> policy at the end of each page's
  // <head>. `is:inline` code isn't hashed, so it only runs from <head>,
  // ahead of that <meta>. Headers that a <meta> can't carry are in
  // vercel.json.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "object-src 'none'",
        "base-uri 'none'",
        "form-action 'none'",
      ],
      // Stylesheets and <style> elements: the site's own. Style attributes
      // are allowed, for the code blocks' inline colours (Shiki).
      styleDirective: {
        resources: [
          { resource: "'self'", kind: "element" },
          { resource: "'unsafe-inline'", kind: "attribute" },
        ],
      },
    },
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
