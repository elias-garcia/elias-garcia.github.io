export const sections = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Writing", href: "/writing" },
] as const;

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
