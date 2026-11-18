import { readFile } from "node:fs/promises";
import satori from "satori";
import sharp from "sharp";

// Share images (DESIGN.md §4, Share images): 1200×630 pictures, always in
// the light theme, rendered at build time. Their sizes are the design's own,
// in pixels of the picture; their colours come from tokens.css. File paths
// are relative to the project root, where Astro runs: bundling moves this
// module.

export const shareImageSize = { width: 1200, height: 630 } as const;

type Style = Record<string, string | number>;
type Element = {
  type: string;
  props: { style?: Style; src?: string; children?: (Element | string)[] };
};

function element(
  type: string,
  style: Style,
  ...children: (Element | string)[]
): Element {
  return { type, props: { style, children } };
}

function image(src: string, style: Style): Element {
  return { type: "img", props: { src, style } };
}

async function lightColours() {
  const tokens = await readFile("src/styles/tokens.css", "utf8");
  const light = tokens.slice(
    0,
    tokens.indexOf("@media (prefers-color-scheme: dark)"),
  );
  const colour = (name: string) => {
    const value = new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, "i").exec(
      light,
    )?.[1];
    if (value === undefined) {
      throw new Error(`No light value for --${name} in tokens.css.`);
    }
    return value;
  };
  return {
    bg: colour("bg"),
    text: colour("text"),
    text2: colour("text-2"),
    text3: colour("text-3"),
  };
}

async function dataUrl(path: string, type: string): Promise<string> {
  return `data:${type};base64,${(await readFile(path)).toString("base64")}`;
}

// Satori reads woff, not the woff2 the page ships. Latin and extended Latin,
// so names like "Łukasz" or "Ödön" render too.
async function fonts() {
  const files = [
    { subset: "latin", weight: 400 },
    { subset: "latin-ext", weight: 400 },
    { subset: "latin", weight: 600 },
    { subset: "latin-ext", weight: 600 },
  ] as const;
  return Promise.all(
    files.map(async ({ subset, weight }) => ({
      name: "Instrument Sans",
      data: await readFile(
        `node_modules/@fontsource/instrument-sans/files/instrument-sans-${subset}-${String(weight)}-normal.woff`,
      ),
      weight,
      style: "normal" as const,
    })),
  );
}

type Colours = Awaited<ReturnType<typeof lightColours>>;

// Items separated by dots, 16px apart: "Projects · Writing · Speaking".
function dotted(items: readonly string[], colours: Colours): Element {
  return element(
    "div",
    { display: "flex", alignItems: "center", gap: 16, color: colours.text2 },
    ...items.flatMap((item, index) =>
      index === 0
        ? [element("span", {}, item)]
        : [
            element("span", { color: colours.text3 }, "·"),
            element("span", {}, item),
          ],
    ),
  );
}

async function render(
  content: (colours: Colours, logo: Element) => Element[],
): Promise<Buffer> {
  const [colours, logoSrc, fontData] = await Promise.all([
    lightColours(),
    dataUrl("src/assets/logo.svg", "image/svg+xml"),
    fonts(),
  ]);
  const logo = image(logoSrc, { width: 33.07, height: 56 });
  const frame = element(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxSizing: "border-box",
      width: shareImageSize.width,
      height: shareImageSize.height,
      padding: "72px 80px",
      overflow: "hidden",
      background: colours.bg,
      color: colours.text,
      fontFamily: "Instrument Sans",
    },
    ...content(colours, logo),
  );
  const svg = await satori(frame, { ...shareImageSize, fonts: fontData });
  return sharp(Buffer.from(svg)).png().toBuffer();
}

function footer(
  details: readonly string[],
  domain: string,
  colours: Colours,
): Element {
  return element(
    "div",
    {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 24,
      fontSize: 28,
    },
    dotted(details, colours),
    element("span", { color: colours.text3 }, domain),
  );
}

// The site's image: logo, photo with name and role, sections and domain.
export async function renderSiteImage(options: {
  name: string;
  role: string;
  sections: readonly string[];
  domain: string;
}): Promise<Buffer> {
  const portrait = await sharp(await readFile("src/assets/avatar.jpg"))
    .resize(400, 400)
    .jpeg()
    .toBuffer();
  return render((colours, logo) => [
    element("div", { display: "flex" }, logo),
    element(
      "div",
      { display: "flex", alignItems: "center", gap: 56 },
      image(`data:image/jpeg;base64,${portrait.toString("base64")}`, {
        width: 200,
        height: 200,
        borderRadius: "50%",
      }),
      element(
        "div",
        { display: "flex", flexDirection: "column", gap: 16 },
        element(
          "span",
          {
            fontSize: 80,
            lineHeight: 1.1,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          },
          options.name,
        ),
        element(
          "span",
          { fontSize: 40, lineHeight: 1.35, color: colours.text2 },
          options.role,
        ),
      ),
    ),
    footer(options.sections, options.domain, colours),
  ]);
}

// A post's image: logo with "name · Writing", the title, and the post's
// details with the domain.
export async function renderPostImage(options: {
  name: string;
  section: string;
  title: string;
  details: readonly string[];
  domain: string;
}): Promise<Buffer> {
  return render((colours, logo) => [
    element(
      "div",
      { display: "flex", alignItems: "center", gap: 24, fontSize: 28 },
      logo,
      dotted([options.name, options.section], colours),
    ),
    element(
      "div",
      {
        display: "flex",
        maxWidth: 960,
        fontSize: 72,
        lineHeight: 1.15,
        fontWeight: 600,
        letterSpacing: "-0.02em",
        textWrap: "balance",
      },
      options.title,
    ),
    footer(options.details, options.domain, colours),
  ]);
}
