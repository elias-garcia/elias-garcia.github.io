# Redesign plan

Temporary. Delete this file when the redesign ships.

## Build order

One page per step. Each step builds the components that page needs (DESIGN.md §3), reusing the ones earlier steps built, and checks them against `design/reference/components.html` and the page's screenshots in both themes and both widths. Each step ends with the reviewer and a commit.

1. ~~**Setup.**~~ Done: Astro project and tooling, tokens, font, content collections, base layout (head, header, footer, skip link, page transitions) and `npm run a11y`.
2. ~~**Home.**~~ Done. Intro with the Download CV menu (and the generated `/cv.md`), about, project tiles, work experience rows, latest posts, speaking and teaching, education and contact. Components: button, menu button, status label, see-more link, list row, expandable row, project tile, Roleburn illustration (in its tile, with the `roleburn-preview` transition name), metadata line, figure, external-link arrow.
3. ~~**Writing.**~~ Done. Intro with Subscribe, topic chips, posts grouped by year, and the RSS feed behind Subscribe. Components: chip.
4. **Post.** The article with its reading progress bar and the `/writing/<slug>.md` version. Components: back link + Copy page, the post-header metadata line (date, topic link, reading time), the prose mapping (headings, links, footnotes, code block, figures for Markdown images), easing demo, author footer, previous/next card.
5. **Projects.** Intro and the project card grid. Components: project card, reusing the Roleburn illustration.
6. **Roleburn case study.** Hero, article and the shared transition into the hero from both the Home tile and the Projects card. Components: project facts and the figure placeholder, reusing the back link, code block and previous/next card.
7. **404.** "Try one of these" rows with the path in the gutter and the broken-link email, reusing the list row.
8. **Site-wide features.** Search dialog and its header button (with key hints), sitemap, `robots.txt` (allowing AI crawlers, DESIGN.md §7), JSON-LD, share images, analytics.
9. **Final pass.** Compare every page with its screenshots in both themes and both widths, in `npm run dev` so draft posts show. Tab through each page with the keyboard. Run the accessibility check once against a build that includes drafts.

## Notes for the next steps

- The project illustrations in `src/components/illustrations/` are drawn for the Home tile (200×150). The Projects cards (step 5) use a wider drawing of the same idea; check `design/reference/projects.html`.
- MDX files don't import components. Pass `EasingDemo`, `RoleburnHero` and `Figure` (and the prose components) through the `components` prop of `<Content />` when rendering posts (step 4) and case studies (step 6).
- Code blocks (step 4): Shiki already uses `theme: 'css-variables'`; set the `--astro-code-*` variables from tokens.
- Reading time: use `getReadingMinutes(post)` from `src/lib/content.ts`.
- `npm run a11y` checks pages only. Add each interactive state (open menu, open dialog) to `scripts/a11y.ts` in the step that builds it.
- When `src/env.d.ts` is added, allow `interface` there in `eslint.config.ts`.
- TypeScript stays on 6.0 because `@astrojs/check` and `typescript-eslint` don't support 7 yet. Move to 7 once both list it as a supported peer.
- `npm run a11y` runs in the installed Google Chrome (`channel: "chrome"`), so any machine or CI runner that runs it needs Chrome.
- Share images (step 8): the page only ships the font as woff2, which Satori cannot read. Give Satori its own font file (woff, ttf or otf) without adding it to the page's `@font-face` rules.
- 404 page (step 7): Lighthouse audits it for SEO too. If it gets `noindex`, add `"autodiscoverUrlBlocklist": ["/404.html"]` to `collect` in `lighthouserc.json` and say so in CLAUDE.md, or the SEO check fails.
- Packages to install in the step that needs them: `@astrojs/sitemap`, `@vercel/analytics`, Satori and sharp (step 8). In step 8, confirm the `@vercel/analytics` component works with no adapter. If not, add `@astrojs/vercel` and update CLAUDE.md.

## Content still missing

- The posts marked `draft: true`.
- The Roleburn screenshot (`<Figure placeholder />` in the case study).
- Public links for the three projects.
- "Rebuilding this site" says feedback stays under 300 milliseconds; the design caps it at 250ms.

## Going live

1. Import the repo into Vercel and check the `redesign` preview.
2. Merge `redesign` into `main`, add `eliasgarcia.dev` in Vercel and point DNS at it.
3. Once the domain serves from Vercel, turn off GitHub Pages and delete the `gh-pages` branch.
