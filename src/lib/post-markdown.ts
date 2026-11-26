import type { ImageMetadata } from "astro";
import { getImage } from "astro:assets";
import type { CollectionEntry } from "astro:content";
import { posix } from "node:path";
import { formatLongDate } from "./format.ts";

// MDX that only makes sense on the page: comments ({/* … */}), components
// that close themselves (<EasingDemo … />), and the tags around components
// with content (<Note>…</Note>), whose content stays.
const mdxOnly = [
  /\{\/\*[\s\S]*?\*\/\}/g,
  /^<[A-Z][\s\S]*?\/>$/gm,
  /<\/?[A-Z][^>]*>/g,
] as const;

const fence = /^```[\s\S]*?^```$/gm;

// Shiki's notation (`// [!code highlight]`) is for the page only.
const codeNotation = /\s*\[!code [^\]]+\]/;

// The path of a Markdown image: ![alt](path)
const image = /(?<=!\[[^\]]*\]\()[^)\s]+/g;

const assets = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/**/*.{avif,gif,jpeg,jpg,png,webp}",
  { eager: true },
);

function stripMdx(markdown: string): string {
  return mdxOnly.reduce((text, pattern) => text.replace(pattern, ""), markdown);
}

function stripNotation(code: string): string {
  return code
    .split("\n")
    .map((line) =>
      codeNotation.test(line)
        ? line.replace(codeNotation, "").replace(/\s*(?:\/\/|#)\s*$/, "")
        : line,
    )
    .join("\n");
}

// Images point to their built file, as a full URL: the Markdown is read
// away from the site.
async function resolveImages(
  markdown: string,
  filePath: string,
  site: URL,
): Promise<string> {
  const urls = new Map<string, string>();
  for (const [path] of markdown.matchAll(image)) {
    if (URL.canParse(path) || urls.has(path)) {
      continue;
    }
    const asset = assets[posix.join("/", posix.dirname(filePath), path)];
    if (asset === undefined) {
      throw new Error(`${filePath}: image "${path}" is not in src/assets.`);
    }
    const { src } = await getImage({ src: asset.default });
    urls.set(path, new URL(src, site).href);
  }
  return markdown.replace(image, (path) => urls.get(path) ?? path);
}

export async function renderPostMarkdown(
  post: CollectionEntry<"writing">,
  site: URL,
): Promise<string> {
  const { title, date } = post.data;
  const source = post.body ?? "";
  const fences = source.match(fence) ?? [];
  const body = source
    .split(fence)
    .map((part, index) => {
      const code = fences[index];
      return stripMdx(part) + (code === undefined ? "" : stripNotation(code));
    })
    .join("")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const resolved = await resolveImages(body, post.filePath ?? "", site);
  return `# ${title}\n\n${formatLongDate(date)}\n\n${resolved}\n`;
}
