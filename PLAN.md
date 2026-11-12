# Redesign plan

Temporary. Delete this file when the redesign ships.

## Build order

One page per step. Each step builds the components that page needs (DESIGN.md §3), reusing the ones earlier steps built, and checks them against `design/reference/components.html` and the page's screenshots in both themes and both widths. Each step ends with the reviewer and a commit.

1. ~~**Setup.**~~ Done: Astro project and tooling, tokens, font, content collections, base layout (head, header, footer, skip link, page transitions) and `npm run a11y`.
2. ~~**Home.**~~ Done. Intro with the Download CV menu (and the generated `/cv.md`), about, project tiles, work experience rows, latest posts, speaking and teaching, education and contact. Components: button, menu button, see-more link, list row, expandable row, project tile, Roleburn illustration (in its tile), metadata line, figure, external-link arrow.
3. ~~**Writing.**~~ Done. Intro with Subscribe, topic chips, posts grouped by year, and the RSS feed behind Subscribe. Components: chip.
4. ~~**Post.**~~ Done. The article with its reading progress bar and the `/writing/<slug>.md` version. Components: back link + Copy page, the post-header metadata line (date, topic link, reading time), the prose (every Markdown element, footnotes with their Notes section, code blocks with the indigo theme, the Note callout and details), easing demo, author footer, previous/next card.
5. ~~**Projects.**~~ Done. Intro and the project card grid (from 640px, the first project spans both columns when the count is odd). Components: project card, project status line (also on the Home tiles) and page intro (shared with Writing), reusing the project illustrations.
6. ~~**Roleburn case study.**~~ Done. The case study page (`/projects/<slug>`) with its hero and the preview morph from Home and Projects. Components: project facts, the Roleburn hero and the figure placeholder, reusing the back link, code block and previous/next card. work-issue and POL funding spreads have draft placeholder case studies (dev only).
7. **Home updates.** From the home-redesign handoff (`CHANGES-home-redesign.md`). Intro line with the location. Work rows: work mode after the company, first-line alignment of date, company and +/×, spaced en dash in ranges (also Education). "Speaking and teaching" split into Speaking and Teaching, without the Lisbon photo: talks dated by month with photo attachments; the course as a link row with the course rating line and a video preview. Project facts: one fact per row below 640px, label in the 112px column. Content: `site.yaml`, `work.yaml`, `talks.yaml` (split into talks and courses) and the generated `/cv.md`; the talk photos and trailer thumbnail into `src/assets/`, `speaking-lisbon-2023.jpg` replaced by `talk-lisbon-slide.jpg` (also in `prose.mdx`) and deleted. Components: list row attachment (photos, video preview), course rating line. `public/cv.pdf` needs the location and work modes too.
8. **404.** The page intro with "404" above the title, "Try one of these" rows with the path in the gutter and the broken-link email, reusing the list row.
9. **Site-wide features.** Search dialog and its header button (with 12px key hints and the input's padding reset), sitemap, `robots.txt` (allowing AI crawlers, DESIGN.md §7), JSON-LD (the Home `Person` with the Porto address), share images, analytics.
10. **Final pass.** Compare every page with its screenshots in both themes and both widths, in `npm run dev` so draft posts show. Tab through each page with the keyboard. Run the accessibility check once against a build that includes drafts.

## Notes for the next steps

- MDX files don't import components. Render them with `<Content components={mdxComponents} />` inside `Prose`, as the post and case study pages do; `src/components/mdx/index.ts` maps Markdown elements to components and lists the components posts and case studies can use.
- `src/content/writing/prose.mdx` is a draft with every prose element (`/writing/prose` in `npm run dev`). Check it against `design/reference/prose.html` whenever prose or code styles change.
- Reading time: use `getReadingMinutes(post)` from `src/lib/content.ts`.
- `npm run a11y` checks pages only. Add each interactive state (open menu, open dialog) to `scripts/a11y.ts` in the step that builds it.
- When `src/env.d.ts` is added, allow `interface` there in `eslint.config.ts`.
- TypeScript stays on 6.0 because `@astrojs/check` and `typescript-eslint` don't support 7 yet. Move to 7 once both list it as a supported peer.
- `npm run a11y` runs in the installed Google Chrome (`channel: "chrome"`), so any machine or CI runner that runs it needs Chrome.
- Share images (step 9): the page only ships the font as woff2, which Satori cannot read. Give Satori its own font file (woff, ttf or otf) without adding it to the page's `@font-face` rules.
- 404 page (step 8): Lighthouse audits it for SEO too. If it gets `noindex`, add `"autodiscoverUrlBlocklist": ["/404.html"]` to `collect` in `lighthouserc.json` and say so in CLAUDE.md, or the SEO check fails.
- Packages to install in the step that needs them: `@astrojs/sitemap`, `@vercel/analytics`, Satori and sharp (step 9). In step 9, confirm the `@vercel/analytics` component works with no adapter. If not, add `@astrojs/vercel` and update CLAUDE.md.

## Content still missing

- The posts marked `draft: true`.
- The Roleburn screenshot (the placeholder `Figure` in the Roleburn case study).
- Public links for the three projects.
- The work-issue and POL funding spreads case studies (draft placeholders).
- "Rebuilding this site" says feedback stays under 300 milliseconds; the design caps it at 250ms.

## Going live

1. Import the repo into Vercel and check the `redesign` preview.
2. Merge `redesign` into `main`, add `eliasgarcia.dev` in Vercel and point DNS at it.
3. Once the domain serves from Vercel, turn off GitHub Pages and delete the `gh-pages` branch.
