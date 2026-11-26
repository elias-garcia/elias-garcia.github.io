import { getLayoutCopy, getPage, getPosts } from "./content.ts";
import type { Section } from "./navigation.ts";
import { routes } from "./routes.ts";

// Writing exists only with a published post: drafts don't count. Without
// one, its pages and every link to it are left out (DESIGN.md §8).
export const hasWriting = (await getPosts()).length > 0;

// The header's navigation: Home, then Writing under its page's title.
export async function getSections(): Promise<readonly Section[]> {
  const [layout, writing] = await Promise.all([
    getLayoutCopy(),
    getPage("writing"),
  ]);
  return [
    { label: layout.homeLabel, href: routes.home },
    ...(hasWriting ? [{ label: writing.title, href: routes.writing }] : []),
  ];
}
