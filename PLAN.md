# Redesign plan

Temporary. Delete this file when the redesign ships.

## Build order

One page per step. Each step builds the components that page needs (DESIGN.md §3), reusing the ones earlier steps built, and checks them against `design/reference/components.html` (or `components-2.html` for prose and search) and the page's screenshots in both themes and both widths. Each step ends with the reviewer and a commit.

1. ~~**Setup.**~~ Done: Astro project and tooling, tokens, font, content collections, base layout (head, header, footer, skip link, page transitions) and `npm run a11y`.
2. ~~**Home.**~~ Done. Intro with the Download CV menu (and the generated `/cv.md`), about, project tiles, work experience rows, latest posts, speaking and teaching, education and contact. Components: button, menu button, see-more link, list row, expandable row, project tile, Roleburn illustration (in its tile), metadata line, figure, external-link arrow.
3. ~~**Writing.**~~ Done. Intro with Subscribe, topic chips, posts grouped by year, and the RSS feed behind Subscribe. Components: chip.
4. ~~**Post.**~~ Done. The article with its reading progress bar and the `/writing/<slug>.md` version. Components: back link + Copy page, the post-header metadata line (date, topic link, reading time), the prose (every Markdown element, footnotes with their Notes section, code blocks with the indigo theme, the Note callout and details), easing demo, author footer, previous/next card.
5. ~~**Projects.**~~ Done. Intro and the project card grid (from 640px, the first project spans both columns when the count is odd). Components: project card, project status line (also on the Home tiles) and page intro (shared with Writing), reusing the project illustrations.
6. ~~**Roleburn case study.**~~ Done. The case study page (`/projects/<slug>`) with its hero and the preview morph from Home and Projects. Components: project facts, the Roleburn hero and the figure placeholder, reusing the back link, code block and previous/next card. work-issue and POL funding spreads have placeholder case studies (see "Content still missing").
7. ~~**Home updates.**~~ Done. From the home-redesign handoff. Intro line with the location. Work rows: work mode after the company, first-line alignment of date, company and +/×, spaced en dash in ranges (also Education). "Speaking and teaching" split into Speaking and Teaching, without the Lisbon photo: talks dated by month with photo attachments; the course as a link row with the course rating line and a video preview. Project facts: one fact per row below 640px, label in the 112px column. Content: `site.yaml`, `work.yaml`, `talks.yaml` (split into talks and courses) and the generated `/cv.md`; the talk photos and trailer thumbnail into `src/assets/`, `speaking-lisbon-2023.jpg` replaced by `talk-lisbon-slide.jpg` (also in `prose.mdx`) and deleted. Components: list row attachment (photos, video preview), course rating line.
8. ~~**404.**~~ Done. The page intro with the "404" label above the title, the sentence naming the missing address (filled in by a script), "Try one of these" rows with the path in the date column (hidden on phones), and the report link with the address prefilled in the email. Components: the page intro's label, the list row's `dateOnPhones` option, and the text link (shared with prose links). The host serves `404.html` with a 404 status.
9. ~~**Search.**~~ Done. The search dialog and its header button on every page: grouped results, key hints (12px, keys grouped 4px apart and 8px before their label), the input's padding reset, the empty, no-results and Download CV states (the formats' step: typing selects a format, never filters), only the title and summary searched (matching word starts, every match in accent text at weight 600), topic rows linking to their topic page, and the JSON index built at build time and carried in the dialog's HTML. A native `<dialog>` opened with `showModal()`; the open states are in `scripts/a11y.ts`. Components: search button, search dialog, search row, key hint. The CV formats now come from `getCvFormats()`, shared with the Download CV menu.
10. ~~**Image viewer.**~~ Done. The talk photos are buttons that open the viewer on Home: the card from 640px (photo, caption, ‹ › on the photo, key hints), and below it the dark full-screen viewer (‹ ›, position dots, drag down to close, pinch to zoom with Panzoom). Back closes it. On rows too narrow for the date column the photos show full width, several in a sideways strip: the site's one container query, at the row's 436px wrap. The open viewer and the next photo are in `scripts/a11y.ts`. Components: image viewer, key hint group (shared with search); the photo attachment's buttons and strip.
11. ~~**Motion pass.**~~ Done. Motion is consistent by role (DESIGN.md §2.5). The three overlays (Download CV menu, search, image viewer) share one recipe: a fade with `--ease` and growth from `--overlay-scale` (0.97) with `--ease-settle`, 150ms for the small ones and 250ms for the viewer, a 100ms fade closing, the fade alone with reduced motion. The project illustrations' loops use tokens.
12. ~~**Site-wide features.**~~ Done. The sitemap (`@astrojs/sitemap`, without the 404 page), `robots.txt` as an endpoint (every crawler allowed, AI crawlers named), page titles as "{page} · Elías García" (Home: the name alone), JSON-LD (`WebSite` and `Person` on Home with the Porto address, `BlogPosting` on posts, typed with `schema-dts`), share images (Satori and sharp at build time: `/share/site.png` for every page, `/share/writing/<slug>.png` per post, with Open Graph and Twitter tags), and Vercel Web Analytics, only in builds on Vercel. The profile's country is now an ISO code named with `Intl`, and a post's reading time is content (`post.yaml`).
13. **Mobile review.** Go through the site on real phones (iOS Safari and others) and collect what needs fixing. Known so far: on iOS 27 the dialogs' fades didn't show (search and the image viewer), though WebKit in Playwright ran them. The motion pass (step 11) made every overlay fade ease out evenly instead of on `--ease-settle`, so check again first; if they still don't show, use Web Inspector and longer durations to find out why. Closing fades exist only where `overlay` is supported (Chrome), for the dialogs and the Download CV menu alike. On Android, check that Back closes the image viewer once and the next Back leaves the page (Back is a close request there, and the viewer also adds a history entry).
14. **Final pass.** Chrome sometimes skips the page transition into the Roleburn case study (and now and then into a post) with an `InvalidStateError` and no script in the stack: about 1 in 5 clicks on the Projects card, the same from search. The page loads fine; find out why the transition is aborted. Compare every page with its screenshots in both themes and both widths, in `npm run dev` so draft posts show. Tab through each page with the keyboard. Run the accessibility check once against a build that includes drafts.

## Notes for the next steps

- MDX files don't import components. Render them with `<Content components={mdxComponents} />` inside `Prose`, as the post and case study pages do; `src/components/mdx/index.ts` maps Markdown elements to components and lists the components posts and case studies can use.
- `src/content/writing/prose.mdx` is a draft with every prose element (`/writing/prose` in `npm run dev`). Check it against `design/reference/prose.html` whenever prose or code styles change.
- Reading time: use `getReadingMinutes(post)` from `src/lib/content.ts`.
- `npm run a11y` checks pages only. Add each interactive state (open menu, open dialog) to `scripts/a11y.ts` in the step that builds it.
- When `src/env.d.ts` is added, allow `interface` there in `eslint.config.ts`.
- TypeScript stays on 6.0 because `@astrojs/check` and `typescript-eslint` don't support 7 yet. Move to 7 once both list it as a supported peer.
- `npm run a11y` runs in the installed Google Chrome (`channel: "chrome"`), so any machine or CI runner that runs it needs Chrome.
- The 404 page has no `noindex`: a real 404 status already keeps it out of search results. If it ever gets one, add `"autodiscoverUrlBlocklist": ["/404.html"]` to `collect` in `lighthouserc.json`, or the SEO check fails.

## Content still missing

- The posts marked `draft: true`.
- The Roleburn screenshot (the placeholder `Figure` in the Roleburn case study).
- Public links for the three projects.
- The work-issue and POL funding spreads case studies: placeholders that only restate each project's description, with TODOs and a figure placeholder.
- `public/cv.pdf`: add the location, the work modes and the talk months, to match `/cv.md`.
- "Rebuilding this site" says feedback stays under 300 milliseconds; the design caps it at 250ms.

## Going live

1. Import the repo into Vercel and check the `redesign` preview.
2. Merge `redesign` into `main`, add `eliasgarcia.dev` in Vercel and point DNS at it.
   Turn on Web Analytics in the Vercel project, then visit a missing address from another page and check that the page view records that address and the referrer (the log of broken links). The site uses `inject()` rather than Vercel's Astro component, which records the path known at build time, `/404`.
3. Once the domain serves from Vercel, turn off GitHub Pages and delete the `gh-pages` branch.
