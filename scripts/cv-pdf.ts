import { build, preview } from "astro";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { chromium } from "playwright";
import { routes } from "../src/lib/routes.ts";

// Prints the CV page to public/cv.pdf (DESIGN.md, CV PDF), then checks the
// PDF as a parser reads it. The page is only built in the `cv` mode, so this
// builds the site in it first, into a folder of its own: dist/ keeps the
// site's build.
const output = new URL("../public/cv.pdf", import.meta.url);
const maximumPages = 2;

// Whitespace is left out on both sides: a parser may split or join lines.
function compact(text: string): string {
  return text.replace(/\s+/g, "");
}

// The PDF must read back as the page's whole text, in order: a parser reads
// a glyph without a character code of its own (one of Inter's alternates)
// as nothing, which drops digits, dots and dashes (DESIGN.md, CV PDF, Fonts).
async function checkPdf(pdf: Buffer, pageText: string) {
  const loading = getDocument({ data: new Uint8Array(pdf) });
  try {
    const parsed = await loading.promise;
    if (parsed.numPages > maximumPages) {
      throw new Error(
        `The CV is ${String(parsed.numPages)} pages long; it must fit ${String(maximumPages)}.`,
      );
    }
    const runs: string[] = [];
    for (let number = 1; number <= parsed.numPages; number += 1) {
      const content = await (await parsed.getPage(number)).getTextContent();
      runs.push(
        ...content.items.map((item) => ("str" in item ? item.str : "")),
      );
    }
    const read = compact(runs.join(""));
    const expected = compact(pageText);
    if (read !== expected) {
      let at = 0;
      while (read[at] === expected[at]) {
        at += 1;
      }
      throw new Error(
        `The CV's text reads "${read.slice(at, at + 40)}" where the page has "${expected.slice(at, at + 40)}".`,
      );
    }
    return parsed.numPages;
  } finally {
    await loading.destroy();
  }
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
  const pages = await checkPdf(pdf, await page.locator("main").innerText());
  await writeFile(output, pdf);
  console.log(
    `Printed the CV: ${String(pages)} pages, ${String(pdf.length)} bytes.`,
  );
} finally {
  await Promise.all([browser.close(), server.stop()]);
  await rm(outDir, { recursive: true, force: true });
}
