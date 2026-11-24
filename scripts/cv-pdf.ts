import { build, preview } from "astro";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";
import { routes } from "../src/lib/routes.ts";

// Prints the CV page to public/cv.pdf (DESIGN.md, CV PDF). The page is only
// built in the `cv` mode, so this builds the site in it first, into a folder
// of its own: dist/ keeps the site's build.
const output = new URL("../public/cv.pdf", import.meta.url);
const maximumPages = 2;

// The page count from the PDF's page tree, which Chrome writes uncompressed.
function countPages(pdf: Buffer): number {
  const count = /\/Type \/Pages\s*\/Count (\d+)/.exec(pdf.toString("latin1"));
  if (count?.[1] === undefined) {
    throw new Error("Couldn't find the page count in the PDF.");
  }
  return Number(count[1]);
}

const outDir = await mkdtemp(join(tmpdir(), "cv-"));
await build({ mode: "cv", outDir, logLevel: "warn" });
const server = await preview({ outDir, logLevel: "warn" });
const browser = await chromium.launch({ channel: "chrome" });
try {
  const page = await browser.newPage();
  await page.emulateMedia({ media: "print", colorScheme: "light" });
  await page.goto(`http://localhost:${String(server.port)}${routes.cvPrint}`, {
    waitUntil: "load",
  });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  const pdf = await page.pdf({
    preferCSSPageSize: true,
    printBackground: true,
    tagged: true,
    outline: true,
  });
  const pages = countPages(pdf);
  if (pages > maximumPages) {
    throw new Error(
      `The CV is ${String(pages)} pages long; it must fit ${String(maximumPages)}.`,
    );
  }
  await writeFile(output, pdf);
  console.log(
    `Printed the CV: ${String(pages)} pages, ${String(pdf.length)} bytes.`,
  );
} finally {
  await Promise.all([browser.close(), server.stop()]);
  await rm(outDir, { recursive: true, force: true });
}
