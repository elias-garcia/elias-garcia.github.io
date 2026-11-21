import type { APIRoute } from "astro";
import { renderCvMarkdown } from "../lib/cv.ts";

export const GET: APIRoute = async () =>
  new Response(await renderCvMarkdown(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
