# Redesign plan

Temporary. Delete this file when the redesign ships.

## Build order

1. **Setup.** Astro project and tooling, tokens, font, content collections, and the base layout: head (with the app icons from `design/head.html`), header, footer, skip link and page transitions. Add `npm run a11y` here so every later step can be verified.
2. **Components** from DESIGN.md §3, each checked against `design/reference/components.html`.
3. **Pages.** Home, Writing, Post (with the `.md` version and Copy page), Projects, the Roleburn case study, 404.
4. **Features.** Search dialog, Download CV menu, RSS, sitemap, JSON-LD, share images, analytics.
5. **Final pass.** Compare every page with its screenshots in both themes and both widths, in `npm run dev` so draft posts show. Tab through each page with the keyboard. Run the accessibility check once against a build that includes drafts.

## Setup notes

Tooling:

- Packages: `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/rss`, `@vercel/analytics`, `typescript-eslint`, `eslint-plugin-astro`, `prettier-plugin-astro`, `@axe-core/playwright`, Satori with sharp.
- Also needed: `@astrojs/check` and `typescript` for `astro check`, and `jiti` for `eslint.config.ts`.
- Add a `.gitignore`. Ignore `design/`, `.agents/` and `.claude/` in Prettier, ESLint and `tsconfig.json`.
- URLs: `site`, `trailingSlash: 'never'` and `build.format: 'file'` in `astro.config.ts`; `cleanUrls` and `trailingSlash: false` in `vercel.json`.

Tokens (`src/styles/tokens.css`):

- Add the type scale (DESIGN.md §2.2) and spacing (§2.3). Font sizes in `rem`.
- Colours with `light-dark()`, following the `modern-web-guidance` dark-mode guide, plus `<meta name="color-scheme" content="light dark">` in the base layout.
- Apply `--control-h` and `--bar-h` as minimum sizes, and use `dvh`, not `vh`, for the full-height page.

Astro:

- Font: Instrument Sans through the Fonts API, weights 400–600, `styles: ["normal"]`, plus a second format because Satori cannot read WOFF2.
- Code blocks: Shiki `theme: 'css-variables'`, with the `--astro-code-*` variables set from tokens in `global.css`.
- Reading time: https://docs.astro.build/en/recipes/reading-time/ (Sätteri tab). Store the minutes as a number so the component formats the label.

To confirm while setting up:

- The `@vercel/analytics` component works with no adapter. If not, add `@astrojs/vercel` and update CLAUDE.md.
- The schema's `image()` helper resolves `speakingPhoto.src` in `site.yaml`.
- `astro preview` serves no-trailing-slash URLs the way Vercel will.

## Content still missing

- The posts marked `draft: true`.
- The Roleburn screenshot (`<Figure placeholder />` in the case study).
- Public links for the three projects.
- "Rebuilding this site" says feedback stays under 300 milliseconds; the design caps it at 250ms.

## Going live

1. Import the repo into Vercel and check the `redesign` preview.
2. Merge `redesign` into `main`, add `eliasgarcia.dev` in Vercel and point DNS at it.
3. Once the domain serves from Vercel, turn off GitHub Pages and delete the `gh-pages` branch.
