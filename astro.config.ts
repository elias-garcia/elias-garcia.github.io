import { satteri } from "@astrojs/markdown-satteri";
import mdx from "@astrojs/mdx";
import { defineConfig, fontProviders } from "astro/config";
import { mdastReadingTimePlugin } from "./src/lib/mdast-reading-time.ts";

export default defineConfig({
  site: "https://eliasgarcia.dev",
  trailingSlash: "never",
  build: {
    format: "file",
  },
  markdown: {
    processor: satteri({
      mdastPlugins: [mdastReadingTimePlugin],
    }),
    shikiConfig: {
      theme: "css-variables",
    },
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
