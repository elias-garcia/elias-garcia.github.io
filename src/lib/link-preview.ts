import { Parser } from "htmlparser2";

// What a page says about itself when it's shared (Open Graph), read for a
// link attachment's card (DESIGN.md, Link attachment).
export type ShareData = {
  title?: string;
  image?: string;
  siteName?: string;
  type?: string;
};

function clean(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

// Reads a page's share data from its HTML: og:title (or the page's <title>),
// og:image as an https address, og:site_name and og:type. The parser only
// splits the markup into tags and text: nothing in the page runs or loads.
// `openGraph` says whether the page had any Open Graph tag: some sites send
// a page without them now and then.
export function readShareData(
  html: string,
  address: string,
): { data: ShareData; openGraph: boolean } {
  const meta = new Map<string, string>();
  let pageTitle = "";
  let inTitle = false;
  let titleRead = false;
  const parser = new Parser({
    onopentag(name, attributes) {
      if (name === "title" && !titleRead) {
        inTitle = true;
      }
      const property = attributes.property ?? attributes.name;
      const content = clean(attributes.content ?? "");
      if (
        name === "meta" &&
        property?.startsWith("og:") === true &&
        content !== "" &&
        !meta.has(property)
      ) {
        meta.set(property, content);
      }
    },
    ontext(text) {
      if (inTitle) {
        pageTitle += text;
      }
    },
    onclosetag(name) {
      if (name === "title" && inTitle) {
        inTitle = false;
        titleRead = true;
      }
    },
  });
  parser.write(html);
  parser.end();

  const title = meta.get("og:title") ?? clean(pageTitle);
  const imageAddress = meta.get("og:image");
  const image =
    imageAddress !== undefined && URL.canParse(imageAddress, address)
      ? new URL(imageAddress, address)
      : undefined;
  const siteName = meta.get("og:site_name");
  const type = meta.get("og:type");
  return {
    data: {
      ...(title !== "" && { title }),
      ...(image?.protocol === "https:" && { image: image.href }),
      ...(siteName !== undefined && { siteName }),
      ...(type !== undefined && { type }),
    },
    openGraph: meta.size > 0,
  };
}

function startsWith(bytes: Uint8Array, text: string, offset = 0): boolean {
  return Array.from(text).every(
    (character, index) => bytes[offset + index] === character.charCodeAt(0),
  );
}

// The kind of image a file holds, from its first bytes rather than what the
// server says it is: only the raster formats the image pipeline re-encodes.
// SVG, which can carry scripts, is never one of them.
export function imageType(bytes: Uint8Array): string | undefined {
  if (startsWith(bytes, "\xFF\xD8\xFF")) {
    return "jpg";
  }
  if (startsWith(bytes, "\x89PNG\r\n\x1A\n")) {
    return "png";
  }
  if (startsWith(bytes, "GIF8")) {
    return "gif";
  }
  if (startsWith(bytes, "RIFF") && startsWith(bytes, "WEBP", 8)) {
    return "webp";
  }
  if (startsWith(bytes, "ftypavif", 4) || startsWith(bytes, "ftypavis", 4)) {
    return "avif";
  }
  return undefined;
}

// The host a card names: without "www.".
export function previewDomain(href: string): string {
  return new URL(href).hostname.replace(/^www\./, "");
}

// A card's title when the page gave none: the host and path, without the
// query or a trailing slash.
export function addressTitle(href: string): string {
  return `${previewDomain(href)}${new URL(href).pathname.replace(/\/$/, "")}`;
}

// A site name worth showing beside the domain: none when it only repeats
// the domain's own name ("YouTube" for youtube.com).
export function namedSite(
  site: string | undefined,
  href: string,
): string | undefined {
  if (site === undefined) {
    return undefined;
  }
  const name = site.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  return previewDomain(href).split(".").includes(name) ? undefined : site;
}
