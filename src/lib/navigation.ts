import { routes } from "./routes.ts";

export type Section = { readonly label: string; readonly href: string };

// The navigation's sections, each with its line from a content file that
// describes them by path. `file` names that file in the errors.
export function describeSections(
  sections: readonly Section[],
  descriptions: Readonly<Record<string, string>>,
  file: string,
) {
  // Against every section the site can have, not just the ones it has now:
  // a section with no content is left out of the navigation, but keeps its
  // line for when it's back.
  const sectionPaths: readonly string[] = [
    routes.home,
    routes.projects,
    routes.writing,
  ];
  const unknown = Object.keys(descriptions).filter(
    (path) => !sectionPaths.includes(path),
  );
  if (unknown.length > 0) {
    throw new Error(
      `\`${file}\` describes paths that aren't sections: ${unknown.join(", ")}.`,
    );
  }
  return sections.map(({ label, href }) => {
    const description = descriptions[href];
    if (description === undefined) {
      throw new Error(`\`${file}\` has no line for \`${href}\`.`);
    }
    return { label, href, description };
  });
}

// The deployed site's URL (`site` in astro.config.ts), which absolute links
// need. `use` says what needed it, in the error.
export function requireSite(site: URL | undefined, use: string): URL {
  if (site === undefined) {
    throw new Error(`Set \`site\` in astro.config.ts for ${use}.`);
  }
  return site;
}

export function toPath(pathname: string): string {
  const path = pathname
    .replace(/\.html$/, "")
    .replace(/\/index$/, "")
    .replace(/\/$/, "");
  return path === "" ? "/" : path;
}

export function currentState(
  href: string,
  pathname: string,
): "page" | "true" | undefined {
  const path = toPath(pathname);
  if (path === href) {
    return "page";
  }
  if (href !== routes.home && path.startsWith(`${href}/`)) {
    return "true";
  }
  return undefined;
}
