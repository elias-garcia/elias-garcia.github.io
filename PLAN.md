# Redesign plan

Temporary. Delete this file when the redesign ships.

## Build order

1. ~~**Setup.**~~ Done: Astro project and tooling, tokens, font, content collections, base layout (head, header, footer, skip link, page transitions) and `npm run a11y`.
2. **Components** from DESIGN.md §3, each checked against `design/reference/components.html`.
3. **Pages.** Home, Writing, Post (with the `.md` version and Copy page), Projects, the Roleburn case study, 404.
4. **Features.** Search dialog (and its header button), Download CV menu, RSS, sitemap, `robots.txt` (allowing AI crawlers, DESIGN.md §7), JSON-LD, share images, analytics.
5. **Final pass.** Compare every page with its screenshots in both themes and both widths, in `npm run dev` so draft posts show. Tab through each page with the keyboard. Run the accessibility check once against a build that includes drafts.

## Notes for the next steps

- `src/pages/index.astro` is a placeholder (name and role only) so the layout has a page to render. Step 3 replaces it.
- MDX files don't import components. Pass `EasingDemo`, `RoleburnHero` and `Figure` (and the prose components) through the `components` prop of `<Content />` when rendering posts and case studies.
- Code blocks: Shiki already uses `theme: 'css-variables'`; set the `--astro-code-*` variables from tokens when building the code block.
- Reading time is in `remarkPluginFrontmatter.minutesRead` (a number) from `render(entry)`.
- `npm run a11y` checks pages only. Add each interactive state (open dialog, open menu) to `scripts/a11y.ts` as the component is built.
- When `src/env.d.ts` is added, allow `interface` there in `eslint.config.ts`.
- TypeScript stays on 6.0 because `@astrojs/check` and `typescript-eslint` don't support 7 yet. Move to 7 once both list it as a supported peer.
- `npm run a11y` runs in the installed Google Chrome (`channel: "chrome"`), so any machine or CI runner that runs it needs Chrome.
- Share images (step 4): the page only ships the font as woff2, which Satori cannot read. Give Satori its own font file (woff, ttf or otf) without adding it to the page's `@font-face` rules.
- To confirm in step 4: the `@vercel/analytics` component works with no adapter. If not, add `@astrojs/vercel` and update CLAUDE.md. Packages still to install then: `@astrojs/sitemap`, `@astrojs/rss`, `@vercel/analytics`, Satori and sharp.

## Content still missing

- The posts marked `draft: true`.
- The Roleburn screenshot (`<Figure placeholder />` in the case study).
- Public links for the three projects.
- "Rebuilding this site" says feedback stays under 300 milliseconds; the design caps it at 250ms.

## Going live

1. Import the repo into Vercel and check the `redesign` preview.
2. Merge `redesign` into `main`, add `eliasgarcia.dev` in Vercel and point DNS at it.
3. Once the domain serves from Vercel, turn off GitHub Pages and delete the `gh-pages` branch.
