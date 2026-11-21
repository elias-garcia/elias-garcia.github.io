import { AxeBuilder } from "@axe-core/playwright";
import { preview } from "astro";
import { readdir } from "node:fs/promises";
import { chromium, type Page } from "playwright";

// Clicks a post's Copy page button with a clipboard that takes the text or
// refuses it. The label only stays for 1.5s, less than a check takes, so
// every pending timer is cancelled to keep it up.
async function copyPage(
  page: Page,
  outcome: "copied" | "failed",
): Promise<void> {
  await page.evaluate((succeeds) => {
    navigator.clipboard.write = () =>
      succeeds
        ? Promise.resolve()
        : Promise.reject(new Error("Refused, for the check."));
  }, outcome === "copied");
  await page.locator("[data-copy-button]").first().click();
  await page.locator(`[data-copy-state="${outcome}"]`).first().waitFor();
  await page.evaluate(() => {
    const last = window.setTimeout(() => undefined, 0);
    for (let id = last; id > 0; id -= 1) {
      window.clearTimeout(id);
    }
  });
}

// Interactive states to check on top of each page's initial state.
const states: Record<
  string,
  readonly { name: string; open: (page: Page) => Promise<void> }[]
> = {
  "/writing/rebuilding-this-site": [
    {
      name: "first footnote marker focused",
      open: (page) => page.locator("a.fn").first().focus(),
    },
    {
      name: "heading anchor focused",
      open: (page) => page.locator(".anchor").first().focus(),
    },
    {
      name: "page copied",
      open: (page) => copyPage(page, "copied"),
    },
    {
      name: "copy failed",
      open: (page) => copyPage(page, "failed"),
    },
  ],
  "/": [
    {
      name: "Download CV menu open",
      open: (page) => page.click('button[popovertarget="cv-formats"]'),
    },
    {
      name: "Download CV menu, first format focused",
      // Tab from the open menu's button, so the link gets :focus-visible.
      open: async (page) => {
        await page.keyboard.press("Tab");
        const focused = await page
          .locator("#cv-formats a")
          .first()
          .evaluate((link) => link.matches(":focus-visible"));
        if (!focused) {
          throw new Error("The first CV format did not get keyboard focus.");
        }
      },
    },
    {
      name: "second work row open",
      open: (page) => page.locator("details.job > summary").nth(1).click(),
    },
    {
      name: "image viewer open",
      // The talk with several photos, so the arrows and the count show.
      open: (page) =>
        page
          .locator("[data-viewer-talk]")
          .filter({ has: page.locator("li + li") })
          .locator("[data-viewer-open]")
          .first()
          .click(),
    },
    {
      name: "image viewer, next photo",
      open: (page) => page.keyboard.press("ArrowRight"),
    },
    {
      name: "search open",
      open: async (page) => {
        await page.keyboard.press("Escape");
        await page.click("[data-search-open]");
      },
    },
    {
      name: "search with results",
      open: async (page) => {
        await page.fill("[data-search-input]", "a");
        await page.locator('[data-results="posts"]:not([hidden])').waitFor();
      },
    },
    {
      name: "search with no results",
      open: async (page) => {
        await page.fill("[data-search-input]", "kubernetes");
        await page.locator('[data-results="topics"]:not([hidden])').waitFor();
      },
    },
    {
      name: "search, Download CV formats",
      open: async (page) => {
        await page.fill("[data-search-input]", "");
        await page.click('[data-action="cv"]');
      },
    },
    {
      name: "search, Download CV with no matching format",
      open: (page) => page.fill("[data-search-input]", "x"),
    },
  ],
};

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

async function check(page: Page, where: string): Promise<void> {
  // A view transition (the image viewer's photo) changes the page only once
  // it has captured it, so it's waited for first.
  await page.evaluate(async () => {
    await document.activeViewTransition?.finished;
  });
  // Contrast is only meaningful once animations have finished.
  // Looping animations never finish, and scroll-driven ones (the reading
  // progress) only at the end of the page, so only wait for timed ones that
  // end; allSettled because a cancelled animation rejects instead of
  // finishing.
  await page.evaluate(() =>
    Promise.allSettled(
      document
        .getAnimations()
        .filter(
          (animation) =>
            animation.timeline instanceof DocumentTimeline &&
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
}

// A step that throws (a timeout, say) stops the run, so name the page and
// the step it stopped at.
async function inStep<Result>(
  where: string,
  step: string,
  run: () => Promise<Result>,
): Promise<Result> {
  try {
    return await run();
  } catch (error) {
    throw new Error(`Stopped at ${where}, ${step}.`, { cause: error });
  }
}

const failures: string[] = [];
const server = await preview({ logLevel: "warn" });
const origin = `http://localhost:${String(server.port)}`;
const browser = await chromium.launch({ channel: "chrome" });

try {
  for (const path of await listPages()) {
    for (const width of widths) {
      for (const colorScheme of colorSchemes) {
        const where = `${path} at ${String(width)}px, ${colorScheme}`;
        const context = await inStep(where, "opening the page", () =>
          browser.newContext({ viewport: { width, height: 800 }, colorScheme }),
        );
        const page = await inStep(where, "opening the page", () =>
          context.newPage(),
        );
        const response = await inStep(where, "loading the page", () =>
          page.goto(`${origin}${path}`, { waitUntil: "load" }),
        );
        // The preview server serves every built page with 200, including /404.
        if (response?.status() !== 200) {
          failures.push(
            `${where}: responded ${String(response?.status())}, expected 200`,
          );
        }

        await inStep(where, "initial state", () => check(page, where));
        for (const state of states[path] ?? []) {
          await inStep(where, state.name, async () => {
            await state.open(page);
            // Hover effects (like dimmed rows) are not part of the state.
            await page.mouse.move(0, 0);
            await check(page, `${where}, ${state.name}`);
          });
        }

        await inStep(where, "closing the page", () => context.close());
      }
    }
  }
} finally {
  // Settled, not awaited one by one: an error in cleanup must not replace the
  // error that stopped the run.
  for (const result of await Promise.allSettled([
    browser.close(),
    server.stop(),
  ])) {
    if (result.status === "rejected") {
      console.error("Cleanup failed:", result.reason);
    }
  }
  // Printed here so the issues found before a step stopped the run aren't lost.
  if (failures.length > 0) {
    console.error(failures.join("\n"));
    process.exitCode = 1;
  }
}

if (failures.length === 0) {
  console.log("No accessibility issues found.");
}
