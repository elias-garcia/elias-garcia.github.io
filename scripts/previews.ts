import { z } from "astro/zod";
import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { parse } from "yaml";
import {
  imageType,
  previewDomain,
  readShareData,
  type ShareData,
} from "../src/lib/link-preview.ts";

// Fetches what each link attachment's page says about itself when shared
// (DESIGN.md §8, Link previews) into src/content/link-previews.json, with its
// image in src/assets/link-previews/. Runs before every build and fetches
// every address each time. An address that can't be fetched keeps what was
// saved for it and prints a warning: link previews never fail the build.
const courses = new URL("../src/content/courses.yaml", import.meta.url);
const output = new URL("../src/content/link-previews.json", import.meta.url);
const images = new URL("../src/assets/link-previews/", import.meta.url);
// Where the saved data points to an image, relative to the JSON file.
const imagePath = "../assets/link-previews/";

const timeout = 5000;
const maximumRedirects = 3;
const maximumPageBytes = 2_000_000;
const maximumImageBytes = 10_000_000;
// Some sites (YouTube) send a page without its share data now and then: it's
// asked for again, up to this many times in all.
const attempts = 3;

const courseSchema = z.record(
  z.string(),
  z.object({ attachment: z.object({ href: z.url() }).optional() }),
);
const savedSchema = z.record(
  z.string(),
  z.object({
    title: z.string().optional(),
    image: z.string().optional(),
    siteName: z.string().optional(),
    type: z.string().optional(),
  }),
);
type Saved = z.infer<typeof savedSchema>;

// Follows redirects by hand, so every step is checked: https only, and at
// most three of them. Returns the response and the address it came from.
async function request(address: string, signal: AbortSignal) {
  let url = new URL(address);
  for (let redirects = 0; ; redirects += 1) {
    if (url.protocol !== "https:") {
      throw new Error(`${url.href} isn't https`);
    }
    const response = await fetch(url, {
      redirect: "manual",
      signal,
    });
    const location = response.headers.get("location");
    if (response.ok) {
      return { response, url };
    }
    // A body that won't be read is let go, so its connection closes.
    await response.body?.cancel();
    if (response.status < 300 || response.status >= 400 || location === null) {
      throw new Error(`${url.href} answered ${String(response.status)}`);
    }
    if (redirects === maximumRedirects) {
      throw new Error(`more than ${String(maximumRedirects)} redirects`);
    }
    url = new URL(location, url);
  }
}

// Reads a body up to a size, or only up to `stop` when given. The match is
// on the bytes as Latin-1, where ASCII tags read the same in any encoding,
// with the end of the previous chunk kept, so a tag split between two
// chunks is still found.
async function readBody(response: Response, limit: number, stop?: RegExp) {
  if (response.body === null) {
    throw new Error("an empty response");
  }
  const chunks: Uint8Array[] = [];
  let size = 0;
  let tail = "";
  for await (const chunk of response.body) {
    chunks.push(chunk);
    size += chunk.byteLength;
    if (size > limit) {
      throw new Error(`more than ${String(limit)} bytes`);
    }
    const text = tail + Buffer.from(chunk).toString("latin1");
    if (stop?.test(text) === true) {
      break;
    }
    tail = text.slice(-16);
  }
  return Buffer.concat(chunks);
}

async function fetchPage(address: string) {
  const signal = AbortSignal.timeout(timeout);
  const { response, url } = await request(address, signal);
  // A page that sends us to another site (a consent or sign-in page) isn't
  // the page linked: its title would replace the card's.
  if (previewDomain(url.href) !== previewDomain(address)) {
    await response.body?.cancel();
    throw new Error(`it sent us to ${url.host}`);
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.startsWith("text/html")) {
    await response.body?.cancel();
    throw new Error(`not an HTML page (${contentType})`);
  }
  const charset =
    /charset="?([^";]+)/i.exec(contentType)?.[1]?.trim() ?? "utf-8";
  const decoder = new TextDecoder(charset);
  // The share data is in the <head>: the rest of the page isn't read.
  const bytes = await readBody(response, maximumPageBytes, /<\/head>|<body/i);
  return readShareData(decoder.decode(bytes), address);
}

// A page without Open Graph tags, after every attempt, only stands in for
// one never saved: its <title> alone is worse than what was.
async function fetchShareData(
  address: string,
  saved: boolean,
): Promise<ShareData> {
  for (let attempt = 1; ; attempt += 1) {
    const { data, openGraph } = await fetchPage(address);
    if (openGraph) {
      return data;
    }
    if (attempt === attempts) {
      if (saved) {
        throw new Error("the page came without its share data");
      }
      return data;
    }
  }
}

// Saves the image under a name made from the page's address, and returns
// the path the saved data points to.
async function fetchImage(address: string, image: string) {
  const { response } = await request(image, AbortSignal.timeout(timeout));
  const bytes = await readBody(response, maximumImageBytes);
  const extension = imageType(bytes);
  if (extension === undefined) {
    throw new Error(`${image} isn't a JPEG, PNG, WebP, AVIF or GIF image`);
  }
  const name = `${createHash("sha256").update(address).digest("hex").slice(0, 16)}.${extension}`;
  await writeFile(new URL(name, images), bytes);
  return `${imagePath}${name}`;
}

function reason(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

const addresses = Object.values(
  courseSchema.parse(parse(await readFile(courses, "utf8"))),
).flatMap(({ attachment }) =>
  attachment === undefined ? [] : attachment.href,
);
const saved = savedSchema.parse(JSON.parse(await readFile(output, "utf8")));
await mkdir(images, { recursive: true });

const previews: Saved = {};
for (const address of new Set(addresses)) {
  const before = saved[address];
  try {
    const { image, ...page } = await fetchShareData(
      address,
      before !== undefined,
    );
    // A page that shows no image for now keeps the saved one.
    let savedImage = before?.image;
    if (image === undefined && savedImage !== undefined) {
      console.warn(
        `Link preview: kept the saved image for ${address}: the page has none now.`,
      );
    }
    if (image !== undefined) {
      try {
        savedImage = await fetchImage(address, image);
      } catch (error) {
        console.warn(
          `Link preview: kept the saved image for ${address}: ${reason(error)}.`,
        );
      }
    }
    previews[address] = {
      ...page,
      ...(savedImage !== undefined && { image: savedImage }),
    };
  } catch (error) {
    if (before !== undefined) {
      previews[address] = before;
    }
    console.warn(
      `Link preview: ${before === undefined ? "no card data" : "kept the saved card"} for ${address}: ${reason(error)}.`,
    );
  }
}

// Images of addresses no longer linked, or saved under another format,
// are removed.
const used = new Set(
  Object.values(previews).flatMap(({ image }) =>
    image === undefined ? [] : image.slice(imagePath.length),
  ),
);
for (const name of await readdir(images)) {
  if (!used.has(name)) {
    await rm(new URL(name, images));
  }
}

const json = `${JSON.stringify(previews, null, 2)}\n`;
if (json !== JSON.stringify(saved, null, 2) + "\n") {
  await writeFile(output, json);
}
console.log(
  `Link previews: ${String(Object.keys(previews).length)} of ${String(new Set(addresses).size)} saved.`,
);
