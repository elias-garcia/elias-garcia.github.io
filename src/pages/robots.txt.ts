import type { APIRoute } from "astro";
import { requireSite } from "../lib/navigation.ts";
import { routes } from "../lib/routes.ts";

// Every crawler is welcome, AI crawlers included (DESIGN.md §7). They're
// also named one by one, so it's clear they're allowed on purpose.
const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

export const GET: APIRoute = ({ site }) => {
  const groups = ["*", ...aiCrawlers].map(
    (agent) => `User-agent: ${agent}\nAllow: /`,
  );
  const sitemap = new URL(
    routes.sitemap,
    requireSite(site, "the sitemap's address"),
  );
  return new Response(`${groups.join("\n\n")}\n\nSitemap: ${sitemap.href}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
