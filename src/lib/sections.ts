import { getLayoutCopy, getPage, getPosts, getProjects } from "./content.ts";
import type { Section } from "./navigation.ts";
import { routes } from "./routes.ts";

// A section with nothing in it isn't built: no page, no link to it anywhere
// (DESIGN.md §8). Each needs one published entry: drafts don't count.
export const hasProjects = (await getProjects()).length > 0;
export const hasWriting = (await getPosts()).length > 0;

// The header's navigation: Home, then each section's page under its title.
export async function getSections(): Promise<readonly Section[]> {
  const [layout, projects, writing] = await Promise.all([
    getLayoutCopy(),
    getPage("projects"),
    getPage("writing"),
  ]);
  return [
    { label: layout.homeLabel, href: routes.home },
    ...(hasProjects ? [{ label: projects.title, href: routes.projects }] : []),
    ...(hasWriting ? [{ label: writing.title, href: routes.writing }] : []),
  ];
}
