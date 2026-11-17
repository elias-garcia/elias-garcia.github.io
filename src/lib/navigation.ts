export const sections = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Writing", href: "/writing" },
] as const;

// The navigation's sections, each with its line from a content file that
// describes them by path. `file` names that file in the errors.
export function describeSections(
  descriptions: Readonly<Record<string, string>>,
  file: string,
) {
  const unused = Object.keys(descriptions).filter(
    (path) => !sections.some(({ href }) => href === path),
  );
  if (unused.length > 0) {
    throw new Error(
      `\`${file}\` describes paths outside the navigation: ${unused.join(", ")}.`,
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
  if (href !== "/" && path.startsWith(`${href}/`)) {
    return "true";
  }
  return undefined;
}
