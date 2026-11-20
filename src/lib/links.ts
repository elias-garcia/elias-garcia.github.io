export function leavesSite(href: string | undefined): href is string {
  return href !== undefined && !href.startsWith("/");
}

// Links to other websites open in a new tab, and so does the RSS feed, so
// its raw XML doesn't replace the page. Pages on this site, downloads and
// `mailto:` links (which open the mail app, not a page) do not.
export function opensNewTab(href: string | undefined): boolean {
  return (
    href !== undefined && (/^https?:\/\//.test(href) || href === "/rss.xml")
  );
}

// A link that opens in a new tab isn't loaded ahead of the click either:
// Astro's prefetch skips other sites by itself, but not this site's feed.
export function linkTarget(href: string | undefined) {
  return opensNewTab(href)
    ? {
        target: "_blank",
        rel: "noopener noreferrer",
        "data-astro-prefetch": "false",
      }
    : {};
}

// Read after a link that opens in a new tab, for screen readers.
export const newTabNote = " (opens in a new tab)";
