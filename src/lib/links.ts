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

const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" });

// The external arrow never starts a line (DESIGN.md, External-link arrow):
// it's kept with the end of its label, the text after the last space, dot,
// slash, hyphen or @. When that is empty or longer than 12 characters, the
// last three characters travel with it instead. Characters as a reader sees
// them, so an emoji made of several code points is never cut.
export function arrowTail(label: string): { start: string; end: string } {
  const characters = Array.from(
    graphemes.segment(label),
    ({ segment }) => segment,
  );
  const lastBreak = characters.findLastIndex((character) =>
    /[\s./@-]/.test(character),
  );
  const after = characters.slice(lastBreak + 1);
  const end =
    after.length === 0 || after.length > 12 ? characters.slice(-3) : after;
  return {
    start: characters.slice(0, characters.length - end.length).join(""),
    end: end.join(""),
  };
}
