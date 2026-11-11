import { AxeBuilder } from "@axe-core/playwright";
import { preview } from "astro";
import { readdir } from "node:fs/promises";
import { chromium } from "playwright";

const widths = [1280, 390, 320] as const;
const colorSchemes = ["light", "dark"] as const;
const tags = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
];

async function listPages(): Promise<string[]> {
  const files = await readdir(new URL("../dist/", import.meta.url), {
    recursive: true,
  });
  return files
    .filter((file) => file.endsWith(".html"))
    .map(
      (file) => `/${file.replace(/\.html$/, "").replace(/(^|\/)index$/, "")}`,
    )
    .sort();
}

const server = await preview({ logLevel: "warn" });
const origin = `http://localhost:${String(server.port)}`;
const browser = await chromium.launch({ channel: "chrome" });
const failures: string[] = [];

try {
  for (const path of await listPages()) {
    for (const width of widths) {
      for (const colorScheme of colorSchemes) {
        const context = await browser.newContext({
          viewport: { width, height: 800 },
          colorScheme,
        });
        const page = await context.newPage();
        const response = await page.goto(`${origin}${path}`, {
          waitUntil: "load",
        });
        const where = `${path} at ${String(width)}px, ${colorScheme}`;
        // The preview server serves every built page with 200, including /404.
        if (response?.status() !== 200) {
          failures.push(
            `${where}: responded ${String(response?.status())}, expected 200`,
          );
        }

        // Contrast is only meaningful once the page entrance has finished.
        // Looping animations never finish, so only wait for the ones that end.
        await page.evaluate(() =>
          Promise.all(
            document
              .getAnimations()
              .filter(
                (animation) =>
                  animation.effect?.getComputedTiming().endTime !== Infinity,
              )
              .map((animation) => animation.finished),
          ),
        );

        const overflows = await page.evaluate(
          () =>
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth,
        );
        if (overflows) {
          failures.push(`${where}: the page scrolls horizontally`);
        }

        const { violations } = await new AxeBuilder({ page })
          .withTags(tags)
          .analyze();
        for (const violation of violations) {
          const targets = violation.nodes
            .map((node) => node.target.join(" "))
            .join(", ");
          failures.push(
            `${where}: ${violation.id} (${violation.help}) on ${targets}`,
          );
        }

        await context.close();
      }
    }
  }
} finally {
  await browser.close();
  await server.stop();
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("No accessibility issues found.");
}
