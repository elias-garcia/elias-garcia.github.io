import { routes } from "./routes.ts";

export function leavesSite(href: string | undefined): href is string {
  return href !== undefined && !href.startsWith("/");
}

// Links to other websites open in a new tab, and so does the RSS feed, so
// its raw XML doesn't replace the page. Pages on this site, downloads and
// `mailto:` links (which open the mail app, not a page) do not.
export function opensNewTab(href: string | undefined): boolean {
  return (
    href !== undefined && (/^https?:\/\//.test(href) || href === routes.feed)
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

// An address as a CV writes it out, for reading on paper:
// "github.com/elias-garcia" for https://www.github.com/elias-garcia/, and the
// address alone for an email.
export function writtenAddress(href: string): string {
  const url = new URL(href);
  if (url.protocol === "mailto:") {
    return url.pathname;
  }
  const path = url.pathname.replace(/\/$/, "");
  return `${url.hostname.replace(/^www\./, "")}${path}${url.search}${url.hash}`;
}
