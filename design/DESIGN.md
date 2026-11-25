# eliasgarcia.dev: design specification

This is the source of truth for the site's design. It was produced in Claude Design and every rule here matches the approved canvas. Where this document and the reference HTML disagree, this document wins.

**How to use this package**

- `design/DESIGN.md` (this file): what to build and the rules it follows.
- `src/styles/tokens.css`: the shared system: every colour, the type and spacing scales, radii, motion, layers and the sizes more than one component uses. Never retype those values. A value only one component uses (the image viewer's card sizes, a footnote marker's size, an illustration's loop) is a custom property at the top of that component's styles, named and commented there.
- `design/reference/*.html`: static renders of every approved page and state, with the real CSS. Open them in a browser to compare, and read their CSS for exact details. They are reference, not source: rebuild them as Astro components rather than copying markup. Interactive behaviour (search, menus, filters) is described in this document because the static files cannot run it.
- `design/screenshots/`: every page at 1280px and 390px, in light and dark, plus the interactive states. Use them to check your output visually.
- `design/assets/`: logo, avatar, talk photos, the course trailer thumbnail, share images (originals; the site uses copies in `src/assets/`). `design/head.html`: the `<head>` tags for every page (viewport, colour scheme, app icons, which live in `public/`).

---

## 1. Principles

1. **One column, quiet by default.** A 688px column (640px of text plus 24px padding). Grey for context, near-black for the thing itself. No cards unless the content is something you can open.
2. **One of each.** Each job has exactly one component. If something new is needed, add it to the component list first; never create a variant inline.
3. **Indigo means state.** The accent marks the current page, the selected chip and links inside prose. Buttons stay neutral.
4. **A link only goes somewhere.** A row or card is a link only if it has a real destination; otherwise it renders as a plain, non-interactive row.
5. **Accessible and semantic first.** WCAG 2.2 AA in both themes, real HTML elements, keyboard paths for everything.

---

## 2. Foundations

### 2.1 Colour

The **zinc** and **indigo** palettes only, 14 tokens, each with a light and a dark value. Dark mode follows `prefers-color-scheme`; there is no manual toggle.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | white | zinc-950 | Page; also text on indigo fills and on the dark skip link |
| `--surface` | zinc-50 | zinc-900 | Previews, code blocks, card hover |
| `--control` | zinc-100 | zinc-800 | Buttons, chips, search icon tiles |
| `--control-hover` | zinc-200 | zinc-700 | Button and chip hover |
| `--line` | zinc-200 | zinc-800 | Every border and divider |
| `--line-strong` | zinc-300 | zinc-700 | Hover borders, illustration strokes |
| `--text` | zinc-900 | zinc-100 | Titles, names, primary text |
| `--text-2` | zinc-600 | zinc-300 | Body copy, descriptions, button labels |
| `--text-3` | zinc-500 | zinc-400 | Dates, metadata, captions, placeholders |
| `--accent` | indigo-600 | indigo-400 | Current page, selected chip, links in prose |
| `--tint` | indigo-50 | indigo-950 | Selected chip, active search row |
| `--tint-strong` | indigo-100 | indigo-900 | Text selection (`::selection`) |
| `--accent-line` | indigo-300 | indigo-700 | Underline under links in prose |
| `--scrim` | zinc-950 at 18% | black at 55% | Behind the search dialog and the image viewer card |
| `--viewer-bg` | black | black | Phone image viewer backdrop (the viewer is dark in both themes) |
| `--viewer-text` | zinc-100 | zinc-100 | Phone viewer caption title, icons, active dot |
| `--viewer-text-2` | zinc-400 | zinc-400 | Phone viewer caption meta (7.6:1 on black) |
| `--viewer-control` | white at 12% | white at 12% | Phone viewer round buttons |
| `--viewer-dot` | white at 32% | white at 32% | Phone viewer inactive dots (decorative) |

Rules:
- `--text-3` sits only on `--bg` or `--surface`, never on `--control` (4.4:1 in light mode, below AA).
- `--control-hover` and `--line` share a value today but are separate roles; never merge them.
- The header uses `--bg` mixed with transparency (`color-mix(in oklab, var(--bg) 82%, transparent)`; `oklab`, not `oklch`, for mixing with a neutral), not new colours.
- In the canvas the accent token was named `--accent-c`; in code it is `--accent`.
- Photos (every image except SVGs) are dimmed to 92% brightness in dark mode, so they don't glare against the dark background.

### 2.2 Typography

One family, **Inter** (the variable font, from Google Fonts through Astro's Fonts API), weights 400 / 500 / 600 only, upright and italic. No optical-size axis: its display cut only tightens the 32px titles a touch, which their tracking already does. No stylistic sets or other `font-feature-settings`; tabular figures only where this spec asks for them. The upright font is preloaded; the italic isn't, so only a page with italic text downloads it. Both load with `font-display: fallback`: a short wait for the font, then a metric-matched Arial, then the native stack (`ui-sans-serif, system-ui, sans-serif`). A cached font is ready within the short wait, so moving between pages doesn't shift the text. Code uses the system monospace stack. Sizes are set in rem (16px = 1rem); this spec writes px.

**The rule: 16px for everything you read or navigate with, on every page.** Paragraphs, titles, the lines under them, dates, job bullets and the header menu are all 16. Hierarchy comes from **colour and weight first** (`--text` 500 for titles, `--text-2` for the line under them, `--text-3` for dates), as on read.cv; size steps in only for page titles and inside posts. **14 is only for facts and compact controls.** Six sizes: **32, 24, 20, 16, 14, 12** (a 1.25 scale from the base). There is no 18.

| Style | Size · weight · line height | Tracking | Use | Element |
|---|---|---|---|---|
| Display | 32 (28 below `sm`) · 600 · 1.2 | −0.02em | Post and case study titles; the "404" label on the 404 page (`--text-3`, `aria-hidden`) | `h1`; `p` (404 label) |
| Title | 24 · 600 · 1.35 | −0.01em | `h2` in posts and case studies | `h2` |
| Subtitle | 20 · 600 / 400 · 1.35 | −0.01em at 600 | Page titles (Home name, Projects, Writing, 404); `h3` and the Notes heading in posts; the case study intro (400, line height 1.5) | `h1`, `h3`, `p` |
| Body | 16 · 400 · 1.6 | 0 | All running text, on every page: post and case study paragraphs and lists, job bullets, About, page intros, callout text | `p`, `li` |
| Label | 16 · 500 / 600 · 1.5 | 0 | Section headings on Home, Writing, Projects and 404 (500, `--text`); item, tile and card titles (500, line height 1.35); `h4` in posts (600); the header menu and the search input and result titles (400) | `h2`, `h3`, `h4`, `a` |
| Second line | 16 · 400 · 1.5 | 0 | The `--text-2` line under a title: job role, post and project summaries, talk venue, course provider. Dates in the left column are the same size in `--text-3` | `span`, `time` |
| Small | 14 · 400 / 500 · 1.5 | 0 | Facts and compact controls only: status and metadata lines, captions, buttons, chips, "All posts" / "View project" links, back links, footer, tables, notes, search summaries and meta | `span`, `time` |
| Micro | 12 · 400 / 500 · 1.5 | 0 | Chip counts, footnote markers (line height 1: a single-line control), key hints, Download CV menu sizes and descriptions, search group labels, code language label | `span` |
| Code | 14 · 400 · 1.7 | 0 | Code blocks (system monospace) | `pre`, `code` |

Body, Label and Second line are all `--text-body`; they differ only in weight, colour and line height.

Nothing a visitor reads is below 12px. Labels inside the decorative project illustrations (9–11px, one 22px number) are part of the drawings and hidden from screen readers.

Line heights: 1 (single-line controls), 1.2 (display), 1.35 (headings and titles), 1.5 (single lines and small text), 1.6 (body), 1.7 (code).

**Wrapping.** `text-wrap: pretty` is set once on the site root, so every wrapped text avoids ending on a single short word: paragraphs, the second line of a list row, tile and card descriptions, captions. Titles that wrap (`h1`, tile titles) override it with `text-wrap: balance`.

The display size is a token, so it changes in one place: `--text-display: 2rem`, `1.75rem` below `sm` (`tokens.css`).

**Line length.** The 640px text column is the measure, and it stays 640: at 16px a full post line holds 80–89 characters (83 on average), inside the 45–90 range USWDS gives for running text. Don't widen the column (720px would put posts at about 100 characters) and don't add a `max-width` in `ch`: `ch` is the width of a "0", 10.1px at 16px in Inter, so 62ch would be wider than the column and never apply. On phones lines run about 40 characters.

### 2.3 Spacing

Ten steps on a 4px grid, each with a job. Space follows **proximity**: a heading sits closer to its own content than to what came before it, and the gap grows with the size of the break. Section headings are the size of the text, so **the space above them does the separating**. 20px is only for padding inside boxed components (code lines, captions, demos, callouts), never between blocks. Only 1–2px hairlines sit off the grid.

| Value | Use |
|---|---|
| 4 | Title to its meta line, icon to label |
| 8 | Page title to its intro; `h4` to its text; between list items in posts; gaps inside controls; metadata dot gaps |
| 12 | Row padding; a display title to its subtitle; `h3` to its text; chip gaps |
| 16 | Paragraph to paragraph; section heading to its content; `h2` to its text; card and menu padding |
| 24 | Around figures, code blocks and tables in posts; back link to title; intro to the topic chips; page side padding; column gaps |
| 32 | Page header to its content; above an `h3`; between Writing years; between project tiles on phones |
| 48 | Above an `h2` in posts and case studies |
| 64 | Top of every page (desktop); before a post's Notes and author footer; between sections and above the footer on phones |
| 80 | Between sections (desktop) |
| 96 | Above the footer (desktop) |

**Page rhythm.** Three page-level gaps step down on phones. They are tokens (`tokens.css`), so every page shares them:

| Token | Desktop | Below `sm` | Use |
|---|---|---|---|
| `--space-page` | 64 | 32 | Top padding of `main`, under the header |
| `--space-section` | 80 | 64 | Between Home sections |
| `--space-footer` | 96 | 64 | Above the footer |

**Where each gap comes from** (measured between boxes):

- **Home:** `main` is a flex column with `gap: var(--space-section)`. The intro header is a column with 32 between the name block and About; About is a 16-gap column: the heading, then one block holding the two paragraphs (16 apart) with `padding: 12px 0`, the same padding a list row carries. Every section is a flex column with `gap: 16px` between its heading row and its content, and the heading has no margins. List rows keep their 12px padding, so the first title sits 28 below the heading. That holds in every list section, Education and Contact included (their rows carry the same 12px padding even though they aren't hover rows), so each heading sits at the same distance from its first line, About's included. No heading row carries a margin, the ones with an "All posts" / "All projects" link included.
- **Writing and topic pages:** intro block (title, 8, text; the Subscribe button beside the title carries `margin: -4px 0`, so the 32px button doesn't make the title row taller than the title's own line and the 8 stays 8) then 24 to the topic chips; 32 to the list; year groups 32 apart, each a 16-gap column (year heading, then rows).
- **Projects, 404:** title, 8, intro; 32 to the content. 404 sections use the same 16 heading gap as Home.
- **Post header:** back link and Copy page, 24, title, 12, metadata line, 32, first paragraph.
- **Case study header:** back link, 24, title, 12, intro (20px), 24, the facts (16px padding between their two hairlines); then 48 to the illustration and 48 to the first heading.
- **Prose** (posts, case studies, the prose test post `src/content/writing/prose.mdx`): see §3 Prose.
- **Project tiles on phones:** 32 between tiles (the last one adds nothing below it).

### 2.4 Radius

| Token | Value | Use |
|---|---|---|
| `--r-sm` | 4px | Key hints, footnote markers, focus ring on text links |
| `--r-md` | 8px | Icon tiles, menu and search rows |
| `--r-lg` | 12px | Cards, previews, code blocks, menus, the search panel |
| `--r-full` | 999px | Buttons, chips |

Circles (avatar, dots) use 50%. The keyboard focus ring follows the shape of whatever is focused.

### 2.5 Motion

Two interface durations, two curves, one rule: **anything that opens or moves takes 250ms; anything that closes or leaves takes 150ms, the same as feedback.** Both sit inside Emil Kowalski's ranges (press 100–160ms, dropdowns 150–250ms, things that open now and then 200–500ms), and nothing a visitor triggers passes 250ms. There were four before (100/150/200/300); the differences between them couldn't be seen, so they are merged. The curve is strong (most of the movement happens in the first third), so a duration at the very bottom of a range is barely visible.

| Token | Value | Use |
|---|---|---|
| `--dur-quick` | 150ms | **Feedback and leaving:** press, hover, colour and opacity, hover underlines, the skip link; the old page fading out; the photo viewer closing; a row or `<details>` collapsing, the Download CV chevron turning back; a dragged-away photo leaving |
| `--dur-move` | 250ms | **Opening and moving:** the Download CV menu opening (and its chevron), the photo viewer opening, a row or `<details>` expanding, photo slides and spring-backs on phones, the Copy → Copied swap, a project's morph into its cover, the page entrance |
| `--ease` | ease-out | Hover and colour changes only |
| `--ease-settle` | cubic-bezier(.22, 1, .36, 1) | Everything that enters, leaves or moves: the page, menus, expanding rows, press feedback, the photo viewer, gestures settling |

**Opening and closing take different times.** Where one element transitions both ways (an expanding row, `<details>`, the Download CV chevron), the resting state carries `--dur-quick` and the open state `--dur-move`: a transition uses the timing of the state it is going to.

The motion system:
1. **Page entrance.** The header never moves. `main` and the footer arrive as one piece: opacity 0→1 and translateY 6px→0 over 250ms (`--dur-move`) with `--ease-settle`. No stagger, no scroll reveals.
2. **Between pages.** Cross-document View Transitions (`@view-transition { navigation: auto; }`, inline in the base layout's `<head>`, not in `global.css`: Chrome checks the new page for it before linked stylesheets apply). The first render waits until the content is parsed (`<link rel="expect" href="#footer" blocking="render">`: the block lifts at the footer's opening tag, right after `<main>`), so a transition never starts on half a page. The header keeps its place (`view-transition-name: site-header`), the old content fades out in 150ms, then step 1 plays. The transition itself ends with that fade-out: the browser's default 250ms on the page and the header is cut to 150ms too, because while a transition runs a click reaches no link (Chrome sends it to the root), and a fast second click would be lost. Step 1 is an ordinary animation and doesn't block clicks. Only a project morph runs longer (250ms). A project's preview (Home tile and Projects card) morphs into its case study's **cover** (see Project cover): one name per project, `view-transition-name: project-<slug>`, from one helper (`coverName()`), plus `view-transition-class: project-cover` for the shared timing and crop (250ms, `--dur-move`). Only the navigation that morphs names them (see Project cover › The morph), so any other arrival isn't held up. This needs a multi-page site, which Astro builds by default.
3. **Interaction.** Every motion has to earn its place (Emil Kowalski's rules; the design passed his `review-animations` and `remove-animations` skills):
   - **Press:** every pressable control responds: buttons, chips, the search button, search's Clear button and Download CV crumb, and the photo viewer's ‹ › × scale to .97; bordered cards that link elsewhere (project tiles and cards, previous / next, the video card) scale to .99. 150ms `--ease-settle`. On touch screens, text links and list rows dim instead (§2.9).
   - **Nothing you do with the keyboard animates.** Search (⌘K) opens and closes instantly, from the shortcut and from the header button alike. Rows you move through with arrow keys (search results, the search crumb) highlight instantly, with no transition, and so do the Download CV menu's links as Tab moves through them. The Download CV menu opened with Enter or Space appears at once and its chevron flips at once; closed with Esc or by tabbing out, it goes at once too. Arrow keys don't open it: it is a list of links, not a `role="menu"`. The photo viewer opened with Enter or Space, closed with Esc (or × from the keyboard), or moved with ← → changes instantly; the same actions with a pointer or a finger keep their motion.
   - **Menus grow from their trigger** (`transform-origin` at the trigger), from scale .97, never scale(0). Build them with a CSS transition and `@starting-style`, not keyframes, so a quick reopen picks up where it is. They close instantly.
   - **Centred dialogs don't move:** they fade from their own centre, the photo viewer included (see Image viewer).
   - **Gestures follow the finger**, accept a flick (speed over 0.11px/ms) as well as a distance, resist past an edge with rising friction, and ignore a second finger. Set the transform on the moving element itself, never through a CSS variable on a parent.
   - **Decorative loops run once and rest:** the "Open to remote roles" dot pings once on load; an illustration cover runs one cycle as its case study opens; the Roleburn figure in the case study runs one cycle the first time it scrolls into view and replays one on hover; previews on Home and Projects stay paused until hovered.
   - **Hover stays quiet.** Hover never moves a card: project tiles and cards only darken their border (their previews start playing). Hover underlines fade in: on one-line labels (header nav, see-more links) a 1px `::after` goes from opacity 0 to 1 (150ms `--ease-settle`); titles that can wrap (post rows) fade a text underline in (`text-decoration-color`, 150ms `--ease`). Arrows still nudge 1–2px toward where they lead.
   - **Prefer transform and opacity.** Expanding rows and `<details>` animate their height (the measured-height exception).
4. **Touch.** Every hover style (colour, underline, movement, list dimming) runs only on a real pointer: `@media (hover: hover) and (pointer: fine)`. Where a hover style is shared with keyboard focus, focus keeps it everywhere. A tap must never leave anything highlighted. Touch gets press states instead (§2.9).
5. **Within Writing.** Moving between `/writing` and its topic pages keeps the page in place: no page entrance, and the posts don't re-enter either (re-animating content on every change is decoration). The previous page comes from the Navigation API; without it, the normal entrance plays.
6. **In-page jumps.** Following a `#` link (heading anchors, footnote markers and back links, the skip link) scrolls smoothly: `@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth } }`. `scroll-padding-top` keeps the target clear of the sticky header, and footnote targets get their arrival tint.
7. **Reduced motion.** Gentler, not zero: pages fade in over 150ms without moving; things fade instead of moving (the photo viewer, the menu, photos); the loops and the dot's ping stop; the skip link appears without sliding.

Deliberate exceptions, each explanatory rather than interface feedback: the easing demo in the post (600ms), the animations inside project illustrations (paused until hovered; one cycle on a case study's cover), the Roleburn figure's one cycle, and the 2s tint on a footnote you jump to.

### 2.6 Elevation and layers

One shadow, `--shadow-overlay`, for things that float (search dialog, image viewer card, Download CV menu). Everything else is flat and separated by borders. The two dialogs share one shell, the base `dialog` style: hairline border, `--r-lg`, `--bg`, the shadow, the `--scrim` backdrop with its blur, and a page behind that doesn't scroll.

| Layer | z-index | Use |
|---|---|---|
| content | 1 | Local stacking inside a component, declared there (the image viewer's buttons above the photo, a case study hero's scan line) |
| `--z-header` | 10 | Sticky header, reading progress bar |
| `--z-skip` | 100 | Skip link |

The search dialog, the image viewer and the Download CV menu sit in the browser's top layer (a modal `<dialog>`, a popover), above everything, so they need no z-index.

### 2.7 Icons

**All icons come from [Tabler Icons](https://tabler.io/icons), through its official Astro package `@tabler/icons-astro`.** Never draw a new icon by hand: pick the closest Tabler icon. That includes brand marks (GitHub, LinkedIn, X…): use Tabler's `brand-*` icons, which are outlines like the rest, never a logo from another set. The only drawings that aren't Tabler are the logo and the project illustrations.

- **Why Tabler:** its style is ours: strokes on a 24px grid, round caps and joins, quiet. It covers every icon below plus brand marks in the same outline style (Lucide 1.0 removed all brand icons). Each icon is an Astro component that renders an inline SVG at build time, so no icon JavaScript ships and only the icons you import end up in the build.
- **One weight, two sizes.** Tabler draws with a 2px stroke on a 24px grid, so at 16px it would render 1.33px. Always pass `stroke={1.5}` and keep it from scaling with `vector-effect: non-scaling-stroke` on the icon's shapes (the package has no prop for it), so the stroke is exactly 1.5px at any size. Colour is `currentColor`. Tabler draws its shapes slightly smaller inside the 24px box than Lucide did: keep the 16 and 12px sizes.

| Token | Size | Use |
|---|---|---|
| `icon-md` | 16px | Icons on their own or in a control: buttons, search result tiles, menu items, header search |
| `icon-sm` | 12px | The inline markers, 4px from their word: the see-more chevron, the external-link arrow, the footnote back-link, the rating star. Never a tap target on their own |

One `Icon` component (`src/components/Icon.astro`) draws them all: `<Icon name="search" />`, with the Tabler name, `size="sm"` for 12px and `filled` for the two filled ones. It imports each icon it uses by name, sets `stroke` 1.5, the non-scaling stroke and `aria-hidden`, and passes on the class a component gives it. Never draw an icon inline in a component.

**The icons in use** (search results are pages, posts, projects and three actions: email, Download CV, RSS; talks and external profiles aren't searched):

| Where | Tabler icon | Size |
|---|---|---|
| Header search button, search input | `search` | 16 |
| Close (search, photo viewer) | `x` | 16 |
| Photo viewer ‹ ›, previous / next cards, back links | `chevron-left`, `chevron-right` | 16 |
| Download CV button (open / closed) | `chevron-down` (rotates 180°) | 16 |
| Work row expand | `plus` (rotates into ×) | 16 |
| Download CV action in search | `download` | 16 |
| PDF format, posts in search results | `file-text` | 16 |
| Markdown format, Copy page | `markdown`: the M↓ mark | 16 |
| Projects in search results | `layout-grid` | 16 |
| Topic suggestions when a search finds nothing | `hash` | 16 |
| Send me an email | `mail` | 16 |
| Subscribe with RSS (button and search action) | `rss`, its dot (the first path) **filled and stroked** (`fill: currentColor`, keeping the 1.5px stroke) everywhere: about 2.8px across. Never `stroke: none`, which leaves a 1.3px dot. After updating Tabler, check the dot is still the first path | 16 |
| Go to (pages) in search | `arrow-right` | 16 |
| Video play button | `player-play` (filled: the outline icon with `fill: currentColor`, not `player-play-filled`, a different drawing) | 16 |
| Copy (code examples on the Foundations board) | `copy` | 16 |
| External-link arrow after a word | `arrow-up-right` | 12 |
| See-more and "View project" chevron | `chevron-right` | 12 |
| Footnote back-link | `corner-down-left` | 12 |
| Course rating | `star` (filled the same way, not `star-filled`) | 12 |
| The CV PDF's contact band | `mail`, `world`, `brand-github`, `brand-linkedin`, `brand-x` | 12 (9pt) |

Icons always sit next to a text label, or carry an accessible name when alone. Decorative icons get `aria-hidden="true"`. In the reference pages each icon carries `data-icon="<tabler name>"`.

### 2.8 Fixed sizes and breakpoint

| Element | Size |
|---|---|
| Content column | 688px (640 + 24 × 2) |
| Date/label gutter | 112px |
| Buttons and chips | 32px tall |
| Header and footer bars | 64px + 1px hairline |
| Search input row | 56px; result rows 48px |
| Home avatar | 104px desktop, 80px on phones |
| Touch hit area | 44px on `pointer: coarse` for every link and control (visible size unchanged) |

One breakpoint, **640px** (Tailwind's `sm`), and nothing else: no other media queries. **One exception, by design:** photo attachments switch on their row's own width with a container query (`@container (width < 436px)`). 436px is exactly where the list row's flex-wrap moves the date above the title (112 + 24 + 300), so the photos change layout at the same moment as the row; a screen breakpoint can't express that, because a 600px window still has the date column. No other container queries. Phone rules apply below it (`width < 40rem`). Grids use explicit column counts per breakpoint, never `auto-fit`/`minmax` (that creates in-between column counts and orphaned items). Below 640px (phones, and narrow tablets or windows):
- the header search shows only its icon (no "⌘K");
- the page-rhythm tokens step down (§2.3): pages start 32px below the header instead of 64, sections sit 64 apart instead of 80, and the footer 64 below the content instead of 96;
- the display title is 28px instead of 32 (`--text-display`);
- the footer drops the offset ("· 5h ahead of you") and keeps one row;
- the Home avatar is 80px and sits above the intro text, left-aligned with it; from 640px it is 104px beside the text;
- work rows put the + beside the date and the company/role below, and an open row's bullets start under the company name (the empty 112px date column is dropped);
- the post meta uses the short date ("Nov 9, 2026");
- Home project tiles and Projects cards go to one per row with 16:7 previews, every card equal (see Components);
- the image viewer becomes the full-screen dark viewer (see Image viewer → Phones).

Talk photos follow the row, not the screen: full width with a sideways scroll on narrow rows (phones), the row of thumbnails wherever the date column fits (see List row attachment → Photos).

### 2.9 Phones and touch

The platform details that make the site feel like an app on a phone rather than a page in a browser (Emil Kowalski's `mobile-native`). The site is a document, so pull-to-refresh and the page's own bounce stay on normal pages. Nothing here changes how the site looks on desktop.

- **Head:** `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content">` and `<meta name="color-scheme" content="light dark">` (`design/head.html`). **Never** `user-scalable=no` or `maximum-scale`: zoom must keep working. `theme-color` is set per colour scheme (white / `#09090b`, the header's background).
  - `interactive-widget=resizes-content`: on Android, the keyboard resizes the page instead of covering it. Search is the only input and the page behind it is locked, so only the search panel resizes: its results list (`dvh`) stays above the keyboard. iOS ignores it, and there the list scrolling under the keyboard is fine.
- **Global CSS** (`global.css`):
  - **No grey tap flash:** `-webkit-tap-highlight-color: transparent` on `html`. Where the browser applies `:active` to touches, every tappable thing has its own press state instead (next points); on iOS only text links have one, by choice.
  - **No double-tap delay:** `touch-action: manipulation` on links and controls.
  - **Control labels can't be long-press selected:** `user-select: none` on buttons, summaries, chips, key hints, search's result rows (options you pick, like a native list's) and the drawings (project covers, the case study figure's drawing; its caption stays text), whose labels are part of the picture. Everything you'd want to copy stays selectable: prose, code, the list rows on the pages, dates, the email address, the footer. Never on `body`.
  - **No font inflation** in landscape (`text-size-adjust: 100%`).
  - **No image menu on a long-pressed talk photo** (`-webkit-touch-callout: none`): it's a button that opens the viewer.
- **Press states on touch.** Buttons, chips and the viewer's controls scale to .97; bordered cards scale to .99 (§2.5). On touch screens (`(hover: none), (pointer: coarse)`), text links and list rows **dim to 60% while pressed** (`--press-dim`), instantly; on release, rows fade back over 150ms (their opacity already transitions) and text links return at once. The Download CV menu's formats count as rows. It replaces the browser's tap highlight, so a tapped link shows something before the next page loads. Buttons, chips and cards keep their own press; a list row dims as a whole when its link is pressed. Use `:active`, never `click`, so feedback appears as the finger lands. If 60% feels heavy on a real phone, .7 is fine; never below .6.
- **No press states on iOS, by choice.** iOS only applies `:active` (every press state above, the scales included) under an element with a touch listener. An empty listener on the page would turn them on, but it also makes iOS apply `:active` the moment a finger lands, so a row dims whenever a scroll starts on it (WebKit bugs 138816 and 310540). The site adds no listener just for that: on an iPhone only text links still dim when pressed (checked on a real iPhone); rows, cards and buttons give no press feedback, as on most sites, while Chrome and Android keep all of theirs (Chrome waits to see whether a touch is a tap and drops `:active` when it scrolls). Inside the photo viewer, whose gestures need a real touch listener, its buttons do press.
- **Hover:** see §2.5 point 4. Only `@media (hover: hover) and (pointer: fine)`, never user-agent checks or screen widths. Because hover never applies on touch, no `@media (hover: none)` block is needed to undo hover styles; don't add one. Phones keep a fake `:hover` on whatever was tapped, so such a block can cancel a press (it once cancelled the cards' .99).
- **Heights:** the page shell that keeps the footer at the bottom of short pages uses `min-block-size: 100svh` (never `100vh`: on phones it's taller than the visible area while the address bar shows). Anything sized to the window while it's open uses `dvh`: the search results list and the desktop viewer card's height limit.
- **Safe areas** (they only work with `viewport-fit=cover`):
  - Header, main and footer side padding: `max(24px, env(safe-area-inset-left / right))` (`--page-start`, `--page-end`), so landscape text never sits under the notch.
  - Footer: bottom padding `env(safe-area-inset-bottom)`.
  - Phone viewer: × 8px in from the top and right insets; the ‹ › row pads its sides the same way; the bottom pads 16px plus the bottom inset.
- **Scroll:** while search or the viewer is open, the page behind doesn't scroll and doesn't pull to refresh (`overscroll-behavior: none` on `html` at that moment only). The search results list and the phone photo strip stop at their ends without moving the page (`overscroll-behavior: contain`).
- **Gestures:** the phone viewer handles drag-down, sideways swipes and pinch itself, so its dialog has `touch-action: none`. The in-page photo strip uses native scroll-snap and needs nothing.
- **Status bar:** while the phone viewer is open, `theme-color` turns `--viewer-bg` (dark in both themes), and goes back when it closes, so the status bar matches the viewer like a native photo viewer.
- **Test on real phones before calling it done:** an iPhone in Safari and an Android phone in Chrome, one of them a few years old, in portrait and once in landscape, with the keyboard open in search. On the iPhone, check that only text links dim, and that no row dims when a scroll starts on it; on Android, that links dim and buttons and cards press. On Android, check that the last search result stays above the keyboard and that closing search with the keyboard open leaves the page where it was. Device emulation reproduces none of the above (tap flash, sticky hover, press states, address-bar height, input zoom, safe areas, pull-to-refresh).

---

## 3. Components

Each component appears exactly once in the design system. Live versions, split by purpose: `reference/components.html` (**interface**: layout, actions, search) and `reference/components-2.html` (**content**: lists and cards, text and metadata, prose), with `screenshots/components.png` and `screenshots/components-2.png`.

### Layout
- **Header.** Sticky (except with very large text, §8 OS text size), 64px, translucent `--bg` with backdrop blur, hairline at the bottom. Logo (links Home) · Home · Projects · Writing (16px, the base size) · search button (magnifier + "⌘K", icon only on phones). The current section is `--accent` with a 1px underline; on hover the other items darken and the same underline fades in (opacity, 150ms `--ease-settle`); inside a case study or post, its parent (Projects/Writing) is current with `aria-current="true"`; on the page itself `aria-current="page"`. The logo and each nav item take a click anywhere in the bar's 64px height, and the nav items also up to halfway into the gaps beside them (12px, 8px on phones), so a click between two goes to the nearer one; the search button keeps its own box. At rest they look the same; hover follows the larger area, like the click, while the keyboard focus ring and the current-page underline stay drawn around the label, not the hit area. Same on every page. **Empty sections** (§8): a nav item exists only while its section does; if neither Projects nor Writing exists there is no `<nav>` at all (it would hold only Home, the page you're on): logo on the left, search button on the right.
- **Footer.** Mirrors the header: 64px bar, hairline on top, content centred; grows only if the two halves wrap. Left: logo + "Elías García, 2026". Right: `<time>12:09</time> in Portugal · 5h ahead of you`. `--space-footer` above it (96, 64 on phones); at the bottom of the window on short pages (the body is a flex column with `min-block-size: 100svh`, `main` flexes). Its bottom pads for the home indicator (`env(safe-area-inset-bottom)`).
- **Footer clock.** Portugal time via `Intl.DateTimeFormat(…, { timeZone: 'Europe/Lisbon' })`, refreshed every 30s. The offset compares with the visitor's clock, rounded to 15 minutes: "same time as you", "5h ahead of you", "5h 30m behind you". The HTML ships with "Portugal" only; the script adds the time and offset. Hidden on phones.
- **Skip link.** "Skip to content", hidden until the first Tab, then a dark pill at the top left; jumps to `#content`, the same on every page. It slides in with `translate` (150ms, `--ease-settle`), never by animating `top`; with reduced motion it appears without sliding.

### Actions
- **Button.** The only action component. 32px, `--control` fill, `--r-full`, 14px label in `--text-2`, optional 16px icon, 8px gap, 12px side padding. Hover `--control-hover`; press scale .97. Never indigo. On a grey surface (the code block) its fill turns `--bg`. Uses: Download CV, Subscribe (Writing), Copy page (posts), Replay and Copy (inside posts).
- **Menu button: Download CV.** Label + chevron (no leading icon); the chevron rotates 180° while open. Opens a 320px menu under the button (`--r-lg`, `--shadow-overlay`): opacity and scale .97→1 from its top-left corner, dropping 4px into place, over 250ms (`--dur-move`) `--ease-settle`, as a transition with `@starting-style`; it closes instantly, and with reduced motion it only fades in. **Opened from the keyboard** (Enter or Space on the button, a click whose `detail` is 0) it appears at once, with no transition, and the chevron flips at once; closed with Esc or Tab it goes at once too. A mouse or touch open still grows in. Its rows highlight instantly. Two links laid out like search rows (icon tile, title, one description line) but at the **compact-control sizes**, because the menu hangs off a 14px button: format name 14, size 12 `--text-3`, description 12 `--text-2`: **PDF · 120 KB**, "For reading, printing and sharing" and **Markdown · 4 KB**, "Plain text for AI tools and agents". It is a short list of links in a popover, not a `role="menu"`: Tab moves through the links. Esc or choosing a format closes it and returns focus to the button; a click outside or tabbing past the last link closes it and leaves focus where the visitor moved it. It also closes as soon as the page scrolls (it would drift from its button and cover the sticky header), except while focus is in the menu, so tabbing through it keeps it open; a mouse wheel always closes it. **In a window too short for it** (a small phone in landscape) the page scrolls just enough to show the whole menu with 16px under it as it opens: smoothly, or at once with reduced motion or when opened from the keyboard; that scroll doesn't close it. It never flips above the button (there isn't room under the sticky header). Without Popover support the two formats stay a plain bordered list under the button, which then opens nothing and loses its chevron: it reads as the list's label. File sizes are computed at build time.
- **Chip.** A set of links that filters a list (Writing topics), each to its own page. 32px, `--control`, label + count badge. Selected (`aria-current="page"`): `--tint` fill, `--accent` label, count badge `--accent` fill with `--bg` text. Never alone, never for actions. "All" first, selected on `/writing`.
- **See-more link.** Muted 14px text + 12px chevron; on hover the text darkens, a 1px underline fades in (an `::after` from opacity 0 to 1, 150ms `--ease-settle`) and the chevron nudges 2px. Only for pages inside the site ("All projects", "All posts").
- **Back link + Copy page.** Top of posts: "‹ Writing" on the left, **Copy page** button on the right with the `markdown` icon (M↓); label changes to "Copied" for 1.5s (see **Copy buttons**); `aria-label="Copy page as Markdown"`. Copies the post's Markdown (generate it at build time from the MDX).
- **Copy buttons** (Copy page, the code blocks' Copy). "Copy" and "Copied" sit in one grid cell (`display: inline-grid`, `grid-area: 1 / 1` on each, centred), so the button always has the width of the longer of the two and never jumps. Copying swaps them: the outgoing label goes to opacity 0, `blur(2px)` and scale .96 while the incoming one returns to opacity 1, no blur, scale 1 (250ms `--dur-move`, `--ease-settle`, transitions so a second click mid-swap reverses smoothly); after 1.5s it swaps back. The hidden labels are `aria-hidden="true"`. While "Copied" (or the failure) shows, it is the button's `aria-label` too, so the name always holds the text on screen (WCAG 2.5.3); then the name returns to "Copy page as Markdown" or "Copy css code". Screen readers don't reliably read a name change on a focused button, so a polite `role="status"` live region next to the button announces "Copied" as well, and the failure below (a repeat is announced too). **When the copy fails** (the browser refuses clipboard access, or the page's Markdown can't be fetched) the label turns to "Couldn't copy" for the same 1.5s and the same region announces it. It is rare, so its label reserves no room: the button grows to fit it. With reduced motion, opacity only.
- **External-link arrow.** A 12px arrow icon (Tabler `arrow-up-right`), 4px after the word, `--text-3` stroke, link colour on hover and a 1px up-right nudge (pointer devices only). Only on standalone links that leave the site: contact rows, the course row, project facts. Links inside prose never get it. Screen readers hear the link text, plus "(opens in a new tab)" when the link opens one.

### Lists and cards
- **List row.** 112px date gutter (`<time>` in `--text-3`), title 16/500, one second line at 16 in `--text-2`, 12px vertical padding, no dividers. Rows are `<li>` in a `<ul role="list">`. When one row is hovered, the other link rows fade to .45 (pointer devices only). The fade covers the whole list the row belongs to: on Writing that is every post across all year groups (the years are one list split by headings; scope the rule to the container of the year groups); on Home each section (Writing, Speaking, Teaching, Work) fades only its own rows. **A row is a link only if it has somewhere to go; otherwise it is a plain row**: not an `<a>`, no hover, not focusable.
- **List row attachment.** Optional media under a list row's text, at most one per row, of one of two kinds. It starts exactly under the row's title: it wraps like the row, with an empty 112px date column beside it that drops away on phones together with the date. 12px from the text above and from the next row. Every attachment image has the same size and shape: a third of the text column (a slot in a row of three, 8px gaps), 3:2, `object-fit: cover`, 8px radius, hairline `--line` border, `--surface` behind it.
  - **Photos:** 1 to 3 images in a `<ul role="list">` grid of three columns; fewer stay left-aligned at the same size; never more than three. Every image has descriptive alt text. **One file per photo**, used by both the thumbnail and the viewer: the talk photos are colour-corrected at their original sizes (1280px wide for House of ZK and AggCave, 2576px for Lisbon). Don't crop, re-colour or keep a second copy of them: the thumbnail is a resized copy of the same file made at build time, so it shows exactly the same centred 3:2 crop as the viewer. Thumbnails are 95–163px wide in the row and up to 435px full width on screens under 484px, so their widths go up to 880 (2× everywhere; more isn't worth the bytes), with `sizes` `(width < 484px) calc(100vw - 3rem), 163px`. Lazy-loaded. Each photo is a `<button>` wrapping the image (`aria-label` "Open photo 2 of 3: {talk title}", `cursor: zoom-in`, image at 88% opacity on hover) that opens the **image viewer** on that photo.
    - **Narrow rows (phones):** when the row is narrower than 436px (the date sits above the title) the photos show full width in the page instead of as thumbnails. One photo fills the text column (3:2). Several sit in a sideways-scrolling strip: `display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 8px; overscroll-behavior-x: contain`, scrollbar hidden; each photo `flex: 0 0 calc(100% - 40px)` with `scroll-snap-align: start`, so the next one peeks 32px. The strip stays inside the text column (never bleeds into the page margins: that keeps it clear of the browser's edge-swipe back gesture and aligned with the text). The photos stay buttons (they are the strip's focusable content) and still open the viewer.
    - **Rows with the date column (tablet, laptop):** the row of three thumbnails above, unchanged.
  - **Video preview:** exactly one bordered card spanning the full text column (`--r-lg`, `--bg`), a single link to the video, separate from the row's link. The thumbnail fills the first third (same size as a photo) with a 32px round play button centred on it (`--bg` at 92% with blur, `--line` border, 16px play icon); then the label (14/500, "Watch the trailer") and the source (14px `--text-3`, "YouTube" + ↗). Hover/focus: the card border goes `--line-strong`, the label turns `--accent`, the play button inverts (`--text` fill, `--bg` icon); press scale .99. It opens the video elsewhere and never embeds a player; no duration.
- **Image viewer.** Opens from a photo attachment. A modal dialog, labelled "Photo 2 of 3: {talk title}", in the search palette's language:
  - **Card:** up to 840px wide: 70% of the window, at most 840px, at least 560px where the window fits it, and never so tall that the caption and key hints leave the screen (`min(840px, max(70%, min(100% - 48px, 560px)), (100dvh - 176px) * 3 / 2)`; 176px is the page padding, caption and key hints). The card is the same size for every photo. 840 is the cap because the smallest talk photos are 1280px wide: beyond it they would be visibly upscaled on high-density screens. `--bg`, `--line` border, `--r-lg`, `--shadow-overlay`, over the `--scrim` backdrop (with 2px blur); the page behind doesn't scroll.
  - **Inside:** the photo on top, in a fixed 3:2 frame that it always fills (`object-fit: cover`, centred): photos of another shape are cropped, never letterboxed, so there are no bars and the card never changes size. It uses the same file as the thumbnail at a larger size (840 and 1680 wide, capped at the file's own width); while it loads, it shows the thumbnail copy already on the page: both are the same 3:2 centre crop of the same file, so nothing shifts when the larger one arrives; a hairline sits below the frame; the caption padded 16px 20px: talk title (16/500) and a meta line (14px `--text-3`): place · date · "2 / 3"; a 44px footer with key hints, "← → to move" and "esc to close" (12px `--text-3`).
  - **Controls:** 40px round buttons (`--bg` at 92% with blur, `--line` border, 16px icons with a 1.5px stroke, `padding: 0` so the browser's default button padding never shifts the icon; on hover `--line-strong` border and `--bg`; press scale .97): × in the photo's top-right corner, ‹ › centred on the photo's left and right edges.
  - **Behaviour:** on open, focus moves to **the viewer itself**: the dialog has `tabindex="-1"` and never shows a focus ring (`outline: none` on `:focus` and `:focus-visible`, beating the site-wide ring). It isn't a control, and its name ("Photo 2 of 3: {talk title}") is what screen readers announce. So ← → change photos with no ring anywhere; Tab reaches ×, then ‹ › with the usual indigo ring, and stays inside the viewer (from the last button it wraps to the first; Shift+Tab from the viewer or its first button wraps to the last). On close focus returns to the thumbnail that opened it. (This follows the W3C dialog pattern for mostly non-interactive content; focusing × made the ring appear on Close as soon as an arrow key was pressed.) Esc, ×, clicking the backdrop and a swipe down (more vertical than horizontal) close it; ← → and ‹ › move, wrapping around, and horizontal swipes move but stop at the first and last photo. A swipe counts past 80px down or 50px sideways, **or as a flick**: faster than 0.11px/ms over at least 16px. A second finger (a pinch) ends the swipe. The count is `aria-live="polite"`. Without JavaScript the photos stay visible and the buttons do nothing.
  - **Opening and closing: a fade, nothing travels.** The viewer is a centred dialog, so it fades from its own centre and never flies out of the thumbnail. **Desktop:** the backdrop fades in over 250ms (`--dur-move`, `--ease-settle`) while the card fades in and grows from 98% to 100% from its centre. **Phones:** the black viewer and the photo fade in together, 250ms, with no scaling (a full-screen photo that grows looks like a glitch). **Closing,** with × or a click on the backdrop: both fade out in 150ms (`--dur-quick`; where a closing dialog can stay in the top layer, `overlay`, CSS fades it out alone; elsewhere `src/lib/top-layer.ts` fades it out while it's still open, then closes it), then focus returns to the thumbnail of the photo on screen, which may not be the one that opened it. Dragging down to close is unchanged (below). **From the keyboard there is no motion:** opened with Enter or Space (a click whose `detail` is 0) or closed with Esc or × from the keyboard, the viewer appears and disappears at once. No View Transition, no shared name: an earlier version morphed the photo out of its thumbnail, and was dropped because the card had to exist before the photo landed (a ghost frame), the backdrop vanished on close, and the corners jumped.
  - **Changing photo:** on desktop the photos are stacked and crossfade (150ms opacity) when you click ‹ ›; only the current one is exposed to assistive tech. With ← → (or ‹ › from the keyboard) the photo changes instantly, on phones too. On phones they sit side by side and slide: the row follows the finger while swiping, then settles on the next photo or springs back (250ms `--dur-move`, `--ease-settle`); ‹ › use the same slide. Swiping past the first or last photo resists with rising friction (`d / (1 + |d| / 120)`) and springs back. **A wrap keeps sliding the way the button points, never back through the middle:** › on the last photo slides the first one in from the right, exactly like any other ›, and ‹ on the first slides the last one in from the left. The photo it wraps to is placed one step past the end of the row (a `translate` on that photo), the row slides one step, then both return to their real positions without a transition; nothing on screen changes at that moment. A tap or a swipe during the slide finishes it at once. Only the photo on screen and its neighbours load, and they're decoded ahead (`img.decode()`), so the first slide to a large photo doesn't stall.
  - **Reduced motion:** no growing, no sliding: the viewer fades in and out and photos crossfade on every screen size.
  - **One photo:** no arrows, no count; ← → do nothing.
  - **Phones (below 640px): the platform photo viewer, dark in both themes.** Full screen on `--viewer-bg` (no card, no blur), photo edge to edge (3:2 frame, filled with `object-fit: cover`) centred in the space above the caption; caption at the bottom (title in `--viewer-text`, meta in `--viewer-text-2`, padded 24px 20px 0); then a row with ‹ and › (44px round, `--viewer-control` fill, `--viewer-text` icons, no border) at the ends and position dots between them (6px, 8px apart, `--viewer-dot`, the current one `--viewer-text`, `aria-hidden`; only with 2+ photos); bottom padding 16px + `env(safe-area-inset-bottom)`, and the ‹ › row pads its sides for a notch the same way. × is 44px at the top right (8px in, plus the status bar and notch insets), same fill. While it's open the status bar turns `--viewer-bg` (`theme-color`), and back when it closes. No key-hint footer, no arrows on the photo.
    - **Drag down to close:** the photo follows the finger (`translate: 0 <dy>` set **on the dialog itself**, no transition while dragging) and the backdrop fades with it (`max(.4, 1 - dy/480)`, a registered, non-inherited property that only the backdrop reads). Dragging up resists (`dy / (1 + |dy| / 60)`). Released past 80px, or flicked: it keeps going down and fades out (150ms); otherwise it springs back (250ms, `--ease-settle`). Lock the gesture's direction after 8px so a sideways swipe never moves it down; follow only the first finger. × stays as the non-gesture alternative (WCAG 2.5.7), and ‹ › as the alternative to swiping (WCAG 2.5.1). Reduced motion: no translate transition; released, the viewer fades out where it was dropped.
    - **Back gesture:** opening pushes a history entry and Back closes the viewer (users expect Back to close full-screen overlays); closing with × or Esc goes back in history, so it stays balanced.
    - **Photo:** not dimmed in dark mode, unlike the page's photos: the viewer looks the same in both themes.
    - **Zoom:** pinch to zoom the photo, up to 4×; not drawn in the design. The zoomed photo fills the space between the × and the caption, and no further: the caption and the buttons stay clear. While zoomed in, one finger pans the photo instead of swiping or dragging; moving to another photo or closing resets the zoom.
  - **Motion:** see "Opening and closing" above; with reduced motion, a fade only.
  - **Short windows:** the card narrows (the last term of its width) so it's never taller than the window less 24px each side; the photo still fills its 3:2 frame, and the caption and the key hints stay on screen, as on a phone held sideways.
  - **Image:** the same file as the thumbnail, 840 and 1680 wide (up to 2× the card), capped at the original's width.
  - **Build:** a native `<dialog>` opened with `showModal()` and `closedby="any"` (click outside closes; a press and release outside where `closedby` isn't supported), as the search does. Back closes it on every screen, not only phones. Pinch zoom is Panzoom (`@panzoom/panzoom`), loaded the first time a photo opens.
- **Course rating line.** Under a course's line: one 12px filled star in `--text`, the score (500, `--text`), the review count in `--text-3` ("4.7 (26 reviews)"), then "30 lessons · 2h 20m" with "·" separators, all 14px `--text-3`. The visible rating is `aria-hidden`; a visually hidden sentence carries it for screen readers: "Rated 4.7 out of 5 from 26 reviews." Never a row of yellow stars. The rating is a fixed value in the content, updated by hand.
- **Expandable row (work experience).** A native `<details>` whose `<summary>` holds the date, company (500) + role, and a + icon that rotates to ×. The body's height animates open (250ms `--dur-move`) and closed (150ms `--dur-quick`: the open state carries the longer transition) where the browser supports `interpolate-size`; elsewhere the row opens and closes instantly. The body lists the bullets (16/1.6 `--text-2`, 8px apart, 16px of padding below the last one). Layout is a grid: `112px 1fr auto` on desktop; on phones `"date icon" / "text text"` so the + stays beside the date. Several can be open at once: an exclusive accordion would close a row above the one you open and move it out of view (Safari doesn't adjust the scroll for it), and would keep you from comparing two jobs. **The newest job is open on load**, the rest closed.
  - **Work mode:** the company line carries how the job was done, after the company name: a "·" (8px each side, `--text-3`) then the mode in 14px 400 `--text-3`: "Remote", or the mode and city ("On-site, A Coruña", "Hybrid, A Coruña"). Plain text: no chips, icons or colour. Screen readers get a visually hidden comma instead of the dot ("Polygon Labs, Remote").
  - **First-line alignment:** the head is a grid aligned to the start; the date and the company share 16px / 24px; the 16px +/× sits in the first line and is centred on it, so all three share the first line's centre. On phones the date and the icon share the first line the same way. Never centre the icon against the whole two-line head.
- **Project tile (Home).** Linked like the Project card below: the title is the link and covers the tile. Preview (`--surface`, `--line` border, `--r-lg`, nothing on top of it), then the title (`h3`), the project status line, and one line of description. One per row with a 16:7 preview below 640px, three in a row with 4:3 from 640px; never two columns. `grid-template-rows: subgrid` keeps titles aligned. On hover its border darkens to `--line-strong` and its preview plays (pointer only); it never lifts.
- **Project card (Projects).** One link per card: the link is the **title alone** (`<li><h2><a>Title</a></h2>…`), so its accessible name is just the title, and its `::after` covers the card (`position: absolute; inset: 0`, the `li` positioned), so the whole card is still one target. The focus ring goes round the card, drawn on that `::after` when the link is `:focus-visible`. The Home tile is built the same way with an `h3`, like the Writing rows. Every project has a page, so every card and tile is a link. Preview with nothing on top of it, then the title row, the project status line, the description. No stack/tags line. On hover the border darkens to `--line-strong`, the preview plays and the "View project" arrow nudges (pointer only); the card never lifts.
  - **Title row (from 640px):** title (`h2`) on the left, the label **"View project"** (14px, `--text-2`) with a 12px chevron (Tabler `chevron-right`) on the right, on one line; the label is styled text beside the title, hidden from screen readers (`aria-hidden="true"`), never a separate link. Read aloud it would be stray text after every heading, and the link's name is the project's title. Same label on every card.
  - **Hover and keyboard focus:** title and label turn `--accent` together (the title is the link and covers the card, so it follows the site-wide link hover, and the label turns with it) and the chevron slides 2px right (150ms, `--ease-settle`), like the see-more links. Pointer devices only for the movement; still with reduced motion.
  - **Phones (below 640px):** the label and chevron are hidden; the title has the whole row; the card is still the one target.
- **Project cover.** One picture per project, declared in its frontmatter (`cover`), shown in three places: the Home tile (4:3; 16:7 on phones), the Projects card (4:3; 16:7 when wide and on phones) and the case study header (**16:7**, full column width: 640 × 280 on desktop). Same box everywhere: `--surface`, 1px `--line` border, `--r-lg`, `overflow: hidden`, nothing on top of it. One `ProjectCover` component (`variant` tile, card or header) renders it everywhere, so the three places can't disagree.
  - **Two kinds:** an **illustration** (an Astro component per project in `src/components/covers/`, decorative, `aria-hidden`), or an **image** (`astro:assets`, one file used everywhere, `object-fit: cover` centred). Images keep their subject inside the middle 58% of the width, which is what a 4:3 crop of a 16:7 picture keeps. Alt text: required in the schema and used on the case study; on tiles and cards the image is `alt=""`, because the title next to it names it.
  - **Image sizes:** header `widths={[640, 960, 1280]}`, `sizes="(max-width: 687px) calc(100vw - 48px), 640px"` (the same on a featured card); tiles and cards `widths={[400, 640, 960, 1280]}`, full column width below 640px, then 198px (tile) or 308px (card). Source at least 1280 × 560.
  - **Motion:** an illustration cover runs one cycle when the case study opens, then rests (paused until hovered on tiles and cards). Under reduced motion it stays still, and nothing morphs.
  - **The morph:** the tile or card and the header cover share `view-transition-name: project-<slug>` and `view-transition-class: project-cover`. The shapes differ (4:3 and 16:7), so the snapshots are cropped while they move, never stretched (`block-size: 100%; object-fit: cover` on `::view-transition-old/new(*.project-cover)`). Nothing carries the name at rest, and each page names its half only when the other page has the partner (`PreviewMorph`, on `pageswap` for the old page and `pagereveal` for the new one): a tile or card when the other page is the case study its link opens, the cover when the other page is in its `data-morph-partners` (Projects, and Home while Home shows that project, `getHomeProjects()`). It depends on the pair of pages, not on the link: between Home or Projects and the case study it morphs whichever link you use (the card, search, the header, the browser's back button). Any other navigation (previous / next between case studies, Writing, a fresh load) has no name, so the cover arrives with the page and clicks aren't blocked by a transition with nothing to morph. Names stay unique however many projects there are, and Home and Projects never morph into each other.
  - **Grid:** one column below 640px, two from 640px. Cards sit 48 apart vertically (Home's stacked tiles on phones: 32). From 640px, with an odd count the first card spans both columns (featured: 16:7 preview, wider illustration; its title is 16/500 like every other card, and descriptions are 16 `--text-2`); pairs use 4:3 previews. Below 640px every card is equal: one per row, 16:7 previews, 16px titles, and the featured card's wider illustration is scaled to match the others.
- **Project status.** A line directly under the project title (4px below it, 8px above the description): 14px `--text-3`, the stage, a separator dot, the year, e.g. "In progress · 2026", "Experiment · 2026". Only an in-progress project gets an 8px `--accent` dot before the text (`aria-hidden`), and it never pulses: pulsing is reserved for "Open to remote roles". The text carries the meaning. Used on Home tiles and Projects cards; previews have no status pill.
- **Previous / next card.** Bordered, `--r-lg`; the chevron sits on the side it leads to; press scale .99 (like the project cards). In a `<nav aria-label="More posts">` (or "More projects").

### Text and metadata
- **Page intro.** The `<header>` that opens Projects, Writing and the 404: optionally a label 4px above the title ("404"), the page title, optionally with an action on its right (Subscribe on Writing), and one paragraph in `--text-2` 8px below, across the full text column (no narrower measure). Anything else in the intro, like the Writing topic chips, sits 24px below.
- **Metadata line.** Items separated by a dot: each dot is its own `aria-hidden` element with an 8px gap on each side (never a dot between plain spaces). On wrapping, a dot stays with the item after it, so a line never ends on a dot. Post header: "November 9, 2026 · Design engineering · 4 min read"; the topic links to its Writing topic page (`/writing/topics/<slug>`).
- **Project facts.** `<dl>`: **Year · Status · Links** in three equal columns between two hairlines; below 640px one fact per row: the 14px label in a 112px column (like the lists' date column) and the 14px value beside it on the same baseline, 24px apart, 12px between rows; links that don't fit wrap under the first, still in the value column. Links are named by destination ("Website", "GitHub", "npm"), product first, code second, with the external arrow, as quiet text links (the text's colour, a grey underline that darkens on hover and focus); none → "Not public yet" in `--text-3`.
- **Author footer.** Ends every post: 40px photo, name (`rel="author"`, links Home) and role, inside the article's `<footer>` / `<address>`.

### Prose (MDX mapping)
Every element a Markdown or MDX post can produce. Live versions of all of them: `reference/prose.html` (and the phone screenshots); its MDX source is the draft post `src/content/writing/prose.mdx`, at `/writing/prose` in `npm run dev` only. Use it to check every element whenever styles change.

**Rhythm.** 16px between blocks (paragraphs, lists, quotes, the thematic break): one blank line at the 16px body size. Headings sit closer to their own text than to what came before them: `h2` 48 above / 16 below, `h3` 32 / 12, `h4` 24 / 8. Boxed and media blocks (figures, code blocks, tables, the easing demo, callouts, details) get 24 above and below. A heading's space below wins over the next block's space above. Spacing never adds up: two boxed blocks in a row sit 24 apart, and a heading after a boxed block keeps its own 48 / 32 / 24 (vertical margins collapse). After the last block, the Notes and the author footer each start 64 below, then the previous/next links 32 below. The case study uses the same rhythm.

| Markdown | Style |
|---|---|
| `## h2` | Title style: 24/600 `--text`; 48px above, 16px below; a `#` anchor link appears on hover and on keyboard focus, 24px to the left |
| `### h3` | Subtitle: 20/600 `--text`; 32px above, 12px below |
| `#### h4` | 16/600 `--text` (the text size, set apart by weight); 24px above, 8px below. No deeper levels |
| `p` | 16/1.6 `--text-2`, `text-wrap: pretty` (inherited: it is set once on the site root, see §2.2); 16px between blocks |
| `**strong**` / `*em*` / `~~del~~` | 600 in `--text` / italic / `--text-3` with line-through |
| `[a](…)` | Prose link: `--accent`, 1px `--accent-line` underline at 3px offset; solid and 2px on hover/focus. No external arrow, even for external links |
| `` `code` `` | 0.875em mono, `--text` on `--control`, `--r-sm`, 0 4px padding. It always takes the size of where it sits (0.875em of a heading or a note). Inside a link it takes the link colour (`color: inherit`) and keeps the underline. |
| `<kbd>` | 14px, `--bg`, 1px `--line` border with a 2px bottom, `--r-sm`, min-width 20px |
| `- list` | 24px indent, 4px round dot in `--text-3`; nested lists get a hollow dot; 8px between items (and above a nested list); two levels max |
| `1. list` | Same indent, numbers in `--text-3` with tabular figures |
| `- [x] task` | No dot; a drawn 16px box (`--line-strong` border, `--r-sm`); checked = `--accent` fill with a `--bg` tick and the item text in `--text-3`. Never use the browser's faded disabled checkbox |
| `> quote` | 2px `--line-strong` rule on the left, 20px indent, same text style (no italics, no colour); an optional source line in 14px `--text-3`. The source sits outside the quote, as the HTML spec asks: `<Quote source="…">` around the Markdown quote renders `figure > blockquote + figcaption` |
| `---` | Thematic break: no line, three spaced dots `· · ·` in `--text-3`, centred, 24px tall |
| image | `<figure>`: full column width, `--r-lg`, 1px `--line` border; caption 14px `--text-3` 8px below |
| table | Inside a bordered `--r-lg` box that scrolls sideways (`overflow-x: auto`, focusable region with a label). Table `width: max-content; min-width: 100%` so cells never wrap mid-word on phones. Header cells 14/500 `--text-3` on `--surface`; body 14/1.5 `--text-2`; row hairlines in `--line`; numeric columns right-aligned with tabular figures |
| ` ```lang ` | Code block, below |
| footnote `[^1]` | See "Footnotes" below: a linked marker and a Notes section at the end of the article, with back links |
| `ul` / `ol` in Notes | The Notes list keeps its own 14px style: scope list styles to lists in the article text (`.body > ul`, `.body li > ul`…), not every list |

MDX-only components, for the occasional post that needs them:
- **Callout** (`<Note>`): `--surface`, 1px `--line` border, `--r-lg`, 16px 20px padding; a 14/500 label ("Note") over 16/1.6 text. Grey, never indigo.
- **Details** (`<details>`): bordered `--r-lg` box; summary 16/500 with a 16px chevron; content indented to the text. Opening and closing animate the height like an expanding row (250ms to open, 150ms to close, `--ease-settle`) and the chevron turns 90° in step. Use the native element with `interpolate-size: allow-keywords` and a transition on `::details-content` (height and `content-visibility … allow-discrete`); browsers without support open instantly, and reduced motion disables it.

**Code blocks.** A bordered block (`--line`, `--r-lg`) on `--surface` with a 48px header bar: the language on the left (12/500 `--text-3`, the code fence's name as written, e.g. `ts`) and the Copy button on the right (fill `--bg` on the grey surface). A fence that names no language (a folder tree, say) has no header bar: no label and no Copy button. Code below: 14/1.7 mono, 16px vertical padding, 20px per line horizontally, horizontal scroll inside the block (focusable region with a label). Blank lines keep their height.

**Syntax theme: minimal indigo.** Mostly neutral; indigo marks keywords and values. Every colour is at least 4.5:1 on `--surface` in both themes (indigo-500 is excluded: 4.4 / 3.9).

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--code-plain` | zinc-600 | zinc-300 | Everything not listed below |
| `--code-keyword` | indigo-600 | indigo-400 | `const`, `import`, `return`, `@media` |
| `--code-literal` | indigo-800 | indigo-200 | Strings and numbers |
| `--code-name` | zinc-900 | zinc-100 | Functions, properties, tags |
| `--code-comment` | zinc-500, italic | zinc-400, italic | Comments |
| `--code-punct` | zinc-500 | zinc-400 | Punctuation and operators |
| `--code-highlight` | indigo-50 | indigo-950 | Highlighted lines, with a 2px `--accent` rule on the left |

All but `--code-literal` are the text, accent and tint colours under another name (`--text-2`, `--accent`, `--text`, `--text-3`, `--tint`), so they are defined once, as aliases.

On a highlighted line, comments switch to `--code-plain` (zinc-500 on indigo-50 falls below 4.5:1). Implementation: `src/lib/shiki-theme.ts`, a Shiki theme that maps token scopes straight to the code tokens; `CodeBlock` styles lines and highlights. Highlight lines in posts with `// [!code highlight]` via `transformerNotationHighlight`. The language label comes from the code fence's language (Astro adds `data-language` to `pre`); map `pre` to a `CodeBlock` component that renders the header bar.

**Footnotes.** No popovers: a footnote is a link to its note, and every note links back.

- **Marker.** A link (`<a href="#note-1" id="ref-1" aria-label="Note 1">1</a>`) placed straight after the word or punctuation it belongs to (after all punctuation except a dash), with only a 4px margin-left: the boxed equivalent of the typographic "no space before a note number". **It is `display: inline`, never `inline-flex` or `inline-block`:** a browser may break the line before any inline box of those kinds, which strands the marker at the start of the next line; a plain inline with no space before it can't be separated from its word. About 20×20: `padding: 2.5px 6px`, `line-height: 1`, `vertical-align: 2px`, `tabular-nums` (so every digit is the same width), `--r-sm`, `--control` fill, 12px/600 `--text-2`. Hover and focus: `--accent` fill with `--bg` text (6.5:1), no underline. Exclude it from the prose-link style (`.body p a:not(.fn)`), or it inherits indigo text and becomes unreadable on hover.
- **Notes section.** After the last paragraph and before the author footer: a plain `<section data-footnotes>` (no role, no name: its visible heading is how it's found) with a 20/600 "Notes" heading and an `<ol>` (14px/1.5, `--text-2`, numbers in `--text-3`). Above it, a short footnote rule: 64px × 1px in `--line`, 64px below the article, then 24px to the heading (a full-width line would compete with the author footer's line just below).
- **Back link.** Each note ends with a return link (`aria-label="Back to reference 1"`): a 12px icon in a 24×24px target (WCAG 2.5.8), `--r-sm`, `--text-3`; on hover and focus `--accent` with a `--control` background. 4px margin-left (after the normal word space), so the hover square starts about 7px from the text and the icon about 13px; negative vertical margin keeps the line height unchanged.
- **Scrolling.** Both directions scroll smoothly (see Motion, in-page jumps). Notes land below the sticky header (`scroll-padding-top`); markers land a third of the way down the screen (`.fn { scroll-margin-top: 30vh }`) so the sentence before them is visible.
- **Arrival.** The note you jump to is tinted `--tint`, fading out over 2s. A marker you return to lights up in its hover colours (`--accent` fill, `--bg` text) and fades back to normal over 2s. With reduced motion the scroll is instant and both stay highlighted.
- **Links and code in notes.** Notes can contain links and inline code; links are normal prose links (`--accent`, `--accent-line` underline, solid on hover) at the note size.
- **In the build.** MDX with GitHub-flavoured footnotes (remark-gfm) already outputs this structure (references, a footnotes section, back links): restyle it to this spec, rename the section label to "Notes", and replace the "↩" text with the icon, through the MDX components map. No DPUB roles: `doc-endnotes` would add a landmark to every post, which the Landmarks rule (§6) leaves out, Astro's attribute types don't allow `doc-*` roles, and the footnote links work without them. The Copy page Markdown keeps standard `[^1]` footnotes.

Custom MDX components: `<EasingDemo />` (two runners, linear vs ease-out, 600ms, Replay button; each track clips its runner, otherwise the moved runners widen the page), `<RoleburnHero caption="…" />` (the animated listings scan, decorative, `aria-hidden`, with its caption; in the article under "How it works", not the page header; it runs one 6s cycle the first time half of it is in view, or it fills half of a screen too short to show half of it (on load if it already is; without scripts, as the page opens), and shows its first frame until then. Afterwards it rests, and hovering it replays one cycle without ever cutting one short; hover does nothing before the first cycle. Reduced motion: it doesn't animate), `<Figure />`.

### Search dialog (⌘K)
- Opens with ⌘K / Ctrl+K and from the header button, **instantly: no opening or closing animation** (it's a keyboard shortcut; animating it makes it feel slow). The input resets the browser default padding (`padding: 0`); its row provides the spacing. A modal `role="dialog"` with `aria-modal="true"` with a 56px input row, a listbox of grouped results and a footer of key hints. **While open, the page behind does not scroll or pull to refresh** (`overflow: hidden` and `overscroll-behavior: none` on `html` while it's open), and the results list stops at its ends without moving the page (`overscroll-behavior: contain`). The input is set up for phone keyboards: 16px (iOS never zooms in on focus), `enterkeyhint="go"`, `autocapitalize="none"`, `autocorrect="off"`, `spellcheck="false"`.
- **Empty state:** Go to (Home, Projects, Writing) and Actions (Send me an email, Download CV, Subscribe with RSS).
- **Typed:** searches posts and projects, and **only what a result row shows: its title and its summary** (a post's description, a project's summary). Topics aren't searched (each topic has its own page, linked from the Writing chips and from No results) and there are no hidden keywords. Every query word must match the start of a word in the title or summary ("ai" never matches inside "daily"; "agent" matches "agents"). Every match is highlighted, in the title and in the summary: `--accent` at weight 600, no background (`mark` reset to `background: none`). A background highlight was dropped: on the selected row it nearly disappeared against `--tint` (1.10:1 light, 1.40:1 dark). Accent text passes on both rows (light 6.46:1 on `--bg`, 5.78:1 on `--tint`; dark 6.36:1 and 5.12:1), and the weight change means the match doesn't rely on colour alone.
- **Rows:** 32px icon tile, title (16px, one line, ellipsis), then a second line in 14px `--text-2`, meta (14px) on the right; the active row is `--tint` with a ↵ hint. For posts and projects the second line is the summary, shown **in full** (it wraps; summaries are one sentence), so a match is never cut off, even on phones; the Download CV formats wrap theirs too. Go to, Actions, Topics and Suggest rows keep their one-line description. ↑↓ move, ↵ opens, Esc closes.
- **Nested choice:** "Download CV" shows › instead of ↵; Enter shows a crumb "Download CV" in the input, the placeholder "Choose a format" and the same two formats (PDF / Markdown with descriptions and sizes). It is a step, not a search: **both formats always stay listed**, and typing only moves the selection to the format whose name or keyword starts with what was typed ("p" or "pdf" → PDF; "m", "md" or "mark" → Markdown), with the typed letters highlighted like a match. If nothing matches, no row is selected, a quiet line appears above the list (14px `--text-3`): "No format matches “x”. Backspace to go back.", and Enter does nothing. ↑ ↓ and the mouse still pick a row and take over from the typing. The footer count stays empty. Esc or Backspace on an empty input goes back; a second Esc closes.
- **No results:** a short message above the list ("No posts or projects match “x”" / "Try a topic I write about, or suggest this one."), then normal rows: **Topics** (each with its post count; a link to that topic's page, `/writing/topics/<slug>`) and **Suggest** ("Suggest “x” as a post", opens an email with "Post idea: x" as subject). Footer shows "0 results". Never a dead end.
  - **Empty sections** (§8): every text in search names only the sections that exist. The input's placeholder and its accessible name say the same thing.

    | Sections | Placeholder (and accessible name) | No results: message | No results: hint and rows |
    |---|---|---|---|
    | Both | "Search posts and projects" | "No posts or projects match “x”" | "Try a topic I write about, or suggest this one." · **Topics**, **Suggest** |
    | No projects | "Search posts" | "No posts match “x”" | same as above |
    | No posts | "Search projects" | "No projects match “x”" | "Try another word, or send me an email." · **Actions**: Send me an email |
    | Neither | "Search the site" | "Nothing matches “x”" | same as the row above |

    Without Writing there are no topics to offer and no post to suggest, so the way out is email. It sits under **Actions**, the same label the empty state uses for the same row: one label per kind of row.
- Index: a small JSON index built from the content collections at build time and carried in the page, so search works offline and never waits on a request: for each post and project its title, summary, URL and meta (date or status), and each topic with its post count and page. No full-text search.
- Build: a native `<dialog>` opened with `showModal()` (modal, Esc and focus return come with it). The header button's shortcut reads "⌘K" on Apple's systems and "Ctrl K" elsewhere (set before the first render); both shortcuts work everywhere. Search needs JavaScript, so without it the button isn't shown.

### Key hint
20px square, 12px text, `--line` border, `--r-sm`, never focusable: ↑ ↓ ↵ esc ← →. In a footer, keys that work together sit 4px apart as a group, and the group sits 8px before its label ("↑ ↓ to move"), so each key and label read as a pair.

---

## 4. Pages

Screenshots for each: `screenshots/<page>.{desktop,phone}.{light,dark}.png`.

### Home (`/`)
1. **Intro.** Avatar (104px; 80px on phones, above the text), name (page title, `h1`), "Software engineer in Porto, Portugal" (one sentence, `--text-2`; no separator here, the "·" is for rows of facts), then **Download CV** menu button and "Open to remote roles" with an indigo dot that pings once when the page opens (a ring scaling 1 → 2.6 while fading, 2.4s) and then rests.
2. **About.** Two paragraphs.
3. **Projects.** The first three projects in the Projects order as tiles + "All projects ›". With one or two projects the tiles keep their size and sit from the left, leaving the other columns empty (like the talk photos); they never stretch to fill the row.
4. **Work experience.** Five expandable rows, Vesu open.
5. **Writing.** The three newest posts as list rows (date "Nov 2026") + "All posts ›".
6. **Speaking.** Three talks as **plain rows** (no recordings exist), dated by month ("Jan 2024", "Jul 2023"), each with a **photo attachment**: House of ZK one photo, AggCave one, Lisbon three. No section photo above the list.
7. **Teaching.** The course as one link row to balio.app (with the arrow): date "Mar 2022", title "The DeFi revolution", line "Online course in Spanish, Balio", the **course rating line**, then a **video preview** attachment ("Watch the trailer", YouTube).
8. **Education.** One plain row, with the list rows' 12px vertical padding.
9. **Contact.** `<address>` with a `<dl>`: Email, GitHub, LinkedIn, X, each value a link with the arrow. Each row has the list rows' 12px vertical padding and no gap between rows (48px rows on desktop).

Sections are plain `<section>` elements, **not labelled**, with `h2` headings at the text size (16/500, `--text`), `--space-section` apart (80, 64 on phones); the intro is a `<header>`. The space above a heading and its place at the left edge mark the section; don't make the headings bigger.

### Projects (`/projects`)
Intro (title, one line), then the card grid: one per row on phones, two per row from 640px with the first spanning both when the count is odd. That covers small counts too: one project is a single full-width card (16:7), two are two half cards side by side. Order: projects in progress first, then the rest; each group by year, newest first, then by title. Every card shows "View project ›" on the title row (from 640px).

### Case study (`/projects/roleburn`)
Back link "‹ Projects", title (display) and lead (the project's description, full column width), project facts, then the **cover** (see Project cover): the same picture as the project's card, which morphs into it. Then the article: Why I built it, How it works (with a folder-tree code block, the Roleburn figure and a placeholder figure), What's next. A project with no article yet has none, and no gap where it would be. **The facts come before the cover:** they describe the project like the status line under a card's title, and the links stay on the first screen. The layout is the same for every project; only the cover and the article change. Previous/next at the end ("Previous", "Next") moves between projects, in the Projects order.

### Writing (`/writing`) and topic pages (`/writing/topics/<slug>`)
Intro with **Subscribe** (RSS icon + label) on the right of the title; topic chips (All, AI, DeFi, Design engineering, with counts); posts grouped by year (`h2`), each an `<article>` in an `<li>` with `<time>`, `h3` title link, description, and "Topic · N min read" (the topic is plain text, not a link, because the row is already a link). Each topic is its own static page, `/writing/topics/<slug>` (e.g. `/writing/topics/ai`), built from the posts: the same page with that chip selected and only its posts, so filtered views are shareable and work without JavaScript. The chips are links in a `nav`; choosing one is a page change where the page stays in place, with no entrance (§2.5). A topic page's `<title>` is "AI · Writing · Elías García" and its description "Posts about AI by Elías García".

### Post (`/writing/<slug>`)
Back link + Copy page, title (display), metadata line, then the article (max 640px, long-form text), a reading-progress bar under the header (scroll-driven animation where supported), the author footer and previous/next.

### 404
- **Header:** the page intro. "404" at Display size (32, 28 on phones · 600 · 1.2, −0.02em, tabular figures) in `--text-3`, `aria-hidden`; 4px below it the page title `h1` "Page not found" (20 · 600), whose accessible text is "404: Page not found" (a visually hidden "404: " before it); 8px below, one sentence in `--text-2`, full width like the other intros: "There's nothing at **{address}**. It may have moved, or the address has a typo." The address is the requested path (`location.pathname`) in `--text` 500, allowed to break after "/" (`<wbr>` after each slash). Without JavaScript, or when the path is empty, the sentence reads "There's nothing at this address." instead.
- **Try one of these:** 32px below, an `h2` "Try one of these" (16 · 500) and three list rows: Home, Projects, Writing, each with its one-line description. From 640px, the path ("/", "/projects", "/writing") sits in the 112px date column as a visual hint, `aria-hidden`; below 640px the path and its column are hidden, so each row is title and description only.
- **Report line:** 32px below, "Followed a link here? **Email me** and I'll fix it." The link is a `mailto:` with subject "Broken link: {address}" and body "I followed a link to {full URL} from: {document.referrer, or nothing}", both URL-encoded. Without JavaScript the subject is "Broken link".
- **Build:** the page returns a real **404 status** (`src/pages/404.astro`, which the host serves for unknown paths; never a redirect to Home, never a 200). Browser title "Page not found · Elías García", like the other pages' titles (§7). 404s are logged by the site's analytics: its page views record the requested path and the referrer. No separate search on the page: the header search (⌘K) is enough.

### Share images (Open Graph, 1200×630)
`assets/share-site.png` and `assets/share-post.png`, templates in `reference/share-*.html`. Always light theme. Top: logo (+ "Elías García · Writing" on posts); middle: photo + name + title, or the post title at 72px; bottom: details on the left, eliasgarcia.dev on the right, dots spaced 16px. No time-sensitive status on them. Generate one per post at build time in a static endpoint, with Satori and sharp.

---

### CV PDF (`/cv.pdf`)
The PDF in the Download CV menu. Printed by Chrome from a page built from the collections (`/cv/print`, only built for printing and in `npm run dev`), never edited by hand: `npm run cv` (`scripts/cv-pdf.ts`), which `npm run build` runs first. Reference: `reference/cv-print.html` (the print page, with its CSS), `reference/cv.pdf` (what it produces: 2 A4 pages, about 100 KB) and `reference/cv-pdf-text.txt` (the text a parser extracts from it, in reading order).

- **Content: only what's in the collections.** Nothing is written for the PDF, and nothing is rephrased. The layout is the PDF's own, not Home's.
- **Header:**
  - The profile photo (40pt, round: the site's 64 step, the height of the name and role line together) beside the name (20pt/600, line height 1.2, −0.02em: the site's display size) and the role line (Home's role line, 10pt, `--text-2`), 4 apart. No availability line.
  - The photo is the site's `avatar.jpg`, resized to 400px with `getImage` (JPEG). It sits in the page body, never in a page header, so the text still extracts cleanly.
- **Contact band,** between two hairlines under the header: the email, the site's domain, then Home's contact list (GitHub, LinkedIn, X). Each is written out as its address (`github.com/elias-garcia`, taken from the link without `https://www.`) and is a link, with a small grey icon in front: Tabler `mail`, `world`, `brand-github`, `brand-linkedin`, `brand-x`, 9pt, `--text-3`. Parsers read the text; the icon only says what it is. Three columns sized to their content and spread to the full width (`grid-template-columns: repeat(3, max-content); justify-content: space-between`), so the five items make two rows.
- **Sections, in this order,** each heading at the text size (600), set apart by space (48 above, 16 below, on the scale under **Spacing and line heights**):
  1. **About:** both paragraphs.
  2. **Experience:** every job with every bullet. The first line is the company (600) · how and where (`mode`, and `place` when there is one, `--text-2`); the second is the job title (`role`, `--text`, 500); then the bullets (`--text-2`, `--text-3` markers). The company description (`about`) isn't shown.
  3. **Projects:** the year, then the title followed on the same line by its address in grey (` · eliasgarcia.dev/projects/roleburn`: its page on the site, which every project has; then the project's own `links`, written out), then the summary. No status: the year is already in the date column, and a label like "Experiment" undersells the work on a CV.
  4. **Speaking:** the date, the title, then where.
  5. **Teaching:** the date, the title followed by the course's address (` · balio.app/curso/defi`), then where. No rating, reviews, lessons or original title.
  6. **Education:** "BSc Computer Science at University of A Coruña", then the detail.
- **Left out:** illustrations and covers, the course trailer, the clock, navigation, availability, statuses.
- **Rows:** a 24mm date column (`--text-3`, ordinary proportional figures, never tabular; the widest date, "2020 – 2024", is about 21mm) beside the text, 24 apart (the scale under **Spacing and line heights**). Titles 500.
- **Type:** Inter, two sizes: 10pt for everything (resume guides ask for 10–12pt) and 20pt for the name. 10pt stands for the site's 16px, so 1px on the site is 0.625pt here.
- **Spacing and line heights: the site's tokens, scaled with the text.** Declared once at the top of the print CSS and used for every gap; no other values.
  - **Spacing:** the site's steps × 0.625: 4 → 2.5pt, 8 → 5pt, 12 → 7.5pt, 16 → 10pt, 24 → 15pt, 32 → 20pt, 48 → 30pt (`--cv-space-4` … `--cv-space-48`).
  - **Each step's job, as on the site:** 4 bullet to bullet, a title to its second line (company to job title, project or talk title to the line under it), name to role line, contact rows; 8 icon to address; 12 job title to its bullets, the contact band's padding; 16 row to row, heading to content, paragraph to paragraph, photo to name, bullet indent; 24 job to job (about one blank line), the date column's gap, under the header, contact columns; 32 contact band to About; 48 between sections (two blank lines). **Each break is bigger than the one inside it** (4 < 12 < 16 < 24 < 48): that's what resume guidance asks for (bullets 0–4pt apart, a blank line between roles, a double break between sections, more space above a heading than below it), and it's what lets a recruiter see the groups before reading a word. A CV is scanned, so it's denser than the site: don't loosen these to the site's page rhythm.
  - **Gaps live on the parent:** each section is a flex column with a 16 gap, jobs sit 24 apart, and rows have no padding, so every heading sits at the same distance from its first line and every section starts at the same distance from the one before.
  - **Line heights:** 1.2 the name; 1.35 titles (company line, job title, project and talk titles); 1.5 everything else (section headings, dates, role line, second lines, contact, About, bullets). The site's 1.6 isn't used: resume guidance puts leading at 120–145% of the text size and calls more than 1.5 too open. Dates and titles share a baseline (`align-items: baseline` on the row).
  - **Fixed sizes** (not on the scale, like the site's): the 24mm date column, 9pt icons, the page margins.
- **Colour:** greys only, no indigo. Hairlines are 0.5pt in the site's `--line-strong` (zinc-300): the paler `--line` can drop out on an office printer. Links keep the colour of their text: on paper they're read, not clicked, but they're still real links in the PDF.
- **Page:**
  - A4, margins 16mm top and bottom, 18mm sides: `@page { size: A4; margin: 16mm 18mm; }`. No page header or footer.
  - **A job never splits across pages:** every row has `break-inside: avoid`, so a job that doesn't fit moves whole to the next page, even if that leaves space at the bottom. Headings have `break-after: avoid`.
  - It must fit two pages. The build fails if it reaches three.
- **For applicant-tracking systems:**
  - One column, real text in reading order.
  - Contact details in the body, never in a page header or footer.
  - Standard section names and one date format; no text in images; every address written out as text.
- **Fonts:** static Inter files (`assets/fonts/Inter-{Regular,Medium,SemiBold}.ttf`, instanced from Inter's variable font at 400/500/600 with the text optical size) for the print page only.
  - **Why not the variable file:** Chrome embeds a variable font as Type 3, which some parsers read badly; Inter's `.otf` files embed as Type 3 too. These `.ttf` files embed as TrueType.
  - **No alternate glyphs, anywhere on the print page:** `font-variant-ligatures: no-contextual`, and no `tabular-nums` or `font-feature-settings` on anything. Inter's tabular figures and punctuation (`tnum`) and its contextual alternates (`calt`, which raises a dash between figures) are extra glyphs with no character code of their own. Chrome writes them into the PDF under private-use codes, so a parser reads every digit, `.`, `,` and `-` as nothing: the dates, the figures and even the dots in the email disappear. `pdftotext` hides the fault (it recovers the characters from the glyph names); pdf.js and most applicant-tracking parsers don't.
  - **The check:** the print reads the PDF back with pdf.js and fails unless its text is the print page's whole text, in order (whitespace aside).
  - **The arrow:** they also include "→" ("Staff Frontend Engineer → Tech Lead"), which the web subset may not.
- **Always the light palette,** whatever the visitor's or the build machine's settings.

## 5. Content and copy rules

- Plain English, sentence case, short sentences. All titles in English; a source in another language is translated and its language noted ("Online course in Spanish").
- Dates: "Nov 9" in lists, "Nov 2026" on Home, "November 9, 2026" in post headers ("Nov 9, 2026" on phones). Always in `<time datetime>`.
- Separators: "·" as its own element with 8px gaps.
- Dates: ranges use a **spaced en dash**, never a hyphen: "2024 – Now", "2013 – 2017" (in markup: `<time>2020</time> – <time>2024</time>`). Single dates are an abbreviated month and year where the month is known ("Jan 2024", "Mar 2022"), with the full value in `datetime` ("2024-01"); work experience and education stay years-only.
- Straight quotes and apostrophes (' ") in visible text, as typed. Markdown doesn't curl them.
- No mention of read.cv anywhere.
- Placeholder content still to replace is listed in `PLAN.md`. Until a destination exists, render rows and cards as plain (not links).

---

## 6. Accessibility and semantic HTML

Every page must pass axe (WCAG 2.2 AA + best practice) in light and dark, at 1280, 390 and 320px, with no horizontal scroll.

- **Weights:** `b` and `strong` are 600 everywhere (base rule), `th` is 500; nothing falls back to the browser's 700.
- **Forced colours** (Windows contrast themes, `@media (forced-colors: active)`): the browser replaces every colour that isn't a system colour, fills included, so nothing may rely on a fill alone.
  - The accent tokens map to `LinkText`, which keeps what is drawn with them: the availability and status dots, the reading progress, a checked task box. The hover and current-page underlines are drawn with `currentColor`, which isn't a system colour, so they are set to `LinkText` too.
  - Buttons, chips, footnote markers and search's small controls get a 1px `ButtonBorder` edge; the selected chip a 2px `Highlight` border; the selected search row and the note you arrive at a `Highlight` outline; a highlighted code line a `Highlight` edge.
  - Bullets and the easing demo's plain runner use `CanvasText`. Text that sits on the accent (the selected chip's count, a focused footnote marker) is `Canvas` on `LinkText`, with `forced-color-adjust: none` so no plate is painted behind it.
  - Text colours are left to the browser, so links keep the system's link colour.
- Landmarks: one `<header>`, `<nav aria-label="Main">`, `<main id="content">`, `<footer>`, and nothing else on most pages. A `<section>` with a name becomes a `region` landmark, so the sections on Home, Writing and the 404 carry no `aria-labelledby`: people move through them by their `h2` headings, and nine named regions would bury the four landmarks that matter. Work experience needs none either: its rows are native `<details>`. A post's Notes carry no name either: the heading is how they're found. Named on purpose: the scrollable code blocks and tables (focusable so the keyboard can scroll them, and anything focusable needs a role and a name). One `h1` per page, no skipped heading levels.
- Lists are `<ul role="list">` (role keeps semantics in Safari with `list-style: none`). Dates are `<time>`. Contact is `<address>` + `<dl>`. Page intros are `<header>` inside `main`, not labelled sections.
- Every interactive element is a real `<a>`, `<button>` or `<summary>`; the Download CV button opens its popover with `popovertarget` and `aria-controls`; the selected chip has `aria-current="page"`; the search uses `role="dialog"`, `aria-modal`, a combobox input and `aria-activedescendant`. Its result count and messages are announced by one hidden status region half a second after typing stops, not on every key; a click outside closes it (`closedby="any"`, with a click listener where that isn't supported); and Enter that only confirms an input method's composition never opens a result.
- Visible focus: 2px `--accent` outline, 3px offset, following the element's shape: every link gets `--r-sm` by default (a base style), and a link with its own shape (a button, a chip, a card) keeps that shape.
- Touch: 44px hit areas on `pointer: coarse` without changing visuals.
- Decorative illustrations are `aria-hidden`; their captions describe them. Rejected listings fading in the Roleburn figure are exempt decorative text.
- Scrollable code blocks are focusable regions with a label.
- `lang` on the document; mark any phrase in another language with `lang`.

---

## 7. Agents, SEO and sharing

- **`.md` for posts only.** A static endpoint `/writing/<slug>.md` per post, generated from the same MDX with custom components stripped; `<link rel="alternate" type="text/markdown">` on each post. Other pages have no `.md` version.
- **Copy page** on posts copies the same Markdown.
- **Open Graph.** Every page has a title, description, URL and share image (with its alt text); posts are shared as `article`, with `article:published_time`.
- **Page titles.** The page first, then the site: "Writing · Elías García", "Rebuilding this site · Elías García" (the template is `pageTitle` in `site.yaml`). Home is the name alone, "Elías García". People scan the start of a title and tabs cut the end, so the page's own words lead. Social cards (`og:title`) carry the page's title alone, since they show the site's name (`og:site_name`) on their own.
- **JSON-LD.** `WebSite` on Home (name and URL, so search results can name the site); `Person` on Home (name, jobTitle, sameAs GitHub/LinkedIn/X, `address` with `addressLocality` "Porto" and `addressCountry` "PT"); `BlogPosting` on posts (author, datePublished, about/topic).
- **RSS** via `@astrojs/rss`, with the same posts as the Writing page (drafts only in `npm run dev`). Subscribe links straight to `/rss.xml`, in a new tab; the feed is not styled (browsers are removing XSLT). **Sitemap** via `@astrojs/sitemap`. **robots.txt** explicitly allows AI crawlers (GPTBot, ClaudeBot, PerplexityBot…).
- **App icons and head:** `design/head.html`.

---

## 8. Build notes

- **Empty sections: build only what has content.** There are no empty states. **Projects** exists when there's at least one published project, and **Writing** when there's at least one published post (drafts don't count). These hold for the production build: in `npm run dev`, drafts count, so both sections show. `src/lib/sections.ts` works out both flags once (`hasProjects`, `hasWriting`) and builds the navigation from them (`getSections()`), so nothing can disagree.
  - **A missing section takes with it:** its Home section and its "All projects" / "All posts" link, its header nav item, its index page and every page under it (case studies; posts and topic pages), its search results group and its "Go to" row, its entries in the 404 suggestions, the sitemap and the site's share image, and the Projects heading of `/cv.md`. A missing Writing also takes the search's Subscribe action, topic suggestions and "Suggest" row.
  - **The RSS feed stays** at `/rss.xml` even with no posts: an empty channel is valid, so anyone subscribed never hits an error.
  - **Not building a page:** the index pages are rest routes (`src/pages/writing/[...index].astro`, `src/pages/projects/[...index].astro`) whose `getStaticPaths` returns `[{ params: { index: undefined } }]` when the section exists and `[]` when it doesn't. Pages under them come from the collections, so they disappear on their own. Content that describes sections by path (search's "Go to" lines, the 404 suggestions) keeps its lines for missing sections.
  - **Links that existed:** if a section later empties, add redirects from `/writing` and `/projects` to `/` in the host config while it stays empty.
  - **Copy:** the About text mentions "the projects and notes"; reword it if a section goes.
- **OS text size:** the base layout opts in with `<meta name="text-scale" content="scale">` (Chrome and Edge 146+; other browsers ignore it), so text follows the reader's system text size. Checked at 200% text on a 320px phone: nothing clipped and no horizontal scroll (code blocks and the talk photos keep their own scrolling). Never set a font size on `html` or `:root`. The three phone layouts that needed it switch with `em` breakpoints, which follow the reader's text size (a 390px phone is 24.4em at the default size and 12.2em at 200%):
  - **Header, below 20em: the bar wraps, never a menu.** It wraps in its own order, with nothing reordered, by its three pieces: the logo, the `<nav>` with its links (which wrap inside it), then the search button (outside the `<nav>`, after it), each moving to the next line when the line is full, left-aligned. At 200% on a phone that gives four lines (logo · Home Projects · Writing · search). Don't flatten the nav with `display: contents` to pack the lines tighter: some browsers drop its landmark and list semantics, which would cost the navigation landmark exactly the people using large text. The gap between items stays the phone header's 16px; lines sit directly under each other, each a 44px touch area tall (the links' hit areas shrink from the bar's 64px to 44px so lines don't overlap). Tab order, reading order and what you see always match: no CSS `order`, no `row-reverse`, no positive `tabindex`. The header stops being sticky below 20em, because a header of several lines kept on screen would take too much of a short screen; the reading progress bar, drawn at its bottom edge, is left out there, since it would scroll away. The search button's line keeps the 44px touch height too. 20em is 320px at the default size, so every normal phone keeps the one-row header.
  - **Search rows: the text wraps, the extras go.** Titles and summaries wrap onto as many lines as they need, never an ellipsis at any size: a truncated result is lost content. The icon tile is centred on the first two lines (title and summary) at every size: `align-self: start` with a top offset of half the difference between those two lines and the tile, from `rem` values so it grows with the text; a two-line row looks exactly as before, and a row that wraps further keeps its icon beside the title (a row with no summary keeps its tile centred). The date or size and the › on nested choices follow the same rule: one line as tall as the title and summary, so on a tall row the icon, the title, the date and the › all sit on the title's level. Below 20em the date (or size) moves under the summary as a third line (14px `--text-3`), so the title gets the row's full width beside the icon; the › stays on the right. A row with no summary (a topic and its post count) gets the same: the count goes under the title, and the icon is centred on both lines. Long words: below 20em only, titles and summaries get `hyphens: auto` (`lang="en"`), so a word too long for the line breaks with a hyphen; never on the email address, which keeps `overflow-wrap: anywhere` alone. The ↵ hint at the end of a row and the footer's key hints are hidden below 30em, and on touch screens at any size, where there's no Enter key to point to; the › on a row that opens more stays.
  - **Contact values break anywhere** (`overflow-wrap: anywhere`), so a long address breaks across lines instead of running off the page.
- **Scrollbar space is always reserved: `html { scrollbar-gutter: stable; }`.** With classic scrollbars (Windows, Linux, macOS set to "always show"), the page keeps room for its scrollbar whether or not it scrolls, so nothing shifts sideways between a short page and a long one, or when search or the photo viewer locks the page's scroll. No `padding-right` compensation: the gutter covers it. The search results list gets the same, so rows don't narrow when typing makes the list long enough to scroll. Overlay scrollbars (phones, macOS by default) take no space. Not `both-edges`: the column is centred in the space left, and a 15px offset is invisible.
- **Projects collection:** `src/content/projects/*.mdx`, one entry per project, the single source for the Home tiles, the Projects cards and the project pages. Projects work like posts: every entry has its page at `/projects/<slug>`, with the same structure (header, facts, cover, then the article from the entry's body; while the body is empty, the page has no article and the entry carries a TODO), and `draft: true` shows it only in `npm run dev`. `cover` is either `{ kind: illustration, name }` or `{ kind: image, src, alt }` (alt required). `cover-image.mdx` is a draft with an image cover, to see image covers in `npm run dev`.
- **Prefetch:** Astro's `prefetch` with `prefetchAll`: hovering or focusing a link to another page of the site loads it ahead of the click (on a slow connection or with data saver, only on press). Downloads and links that open in a new tab opt out (`data-astro-prefetch="false"`).
- **Security headers and CSP:** only the site's own scripts and styles run. Astro's `security.csp` writes each page's policy as a `<meta>` with the hashes of its scripts and styles (`default-src 'self'`, no objects, no `<base>`, no form targets; stylesheets and `<style>` elements only from the site, and inline `style` attributes allowed for the code blocks' colours). Astro warns on every start that Shiki's inline styles don't work with a CSP; with style attributes allowed they do, and the warning can't be turned off. `vercel.json` sends what a `<meta>` can't: `frame-ancestors 'none'` with `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` and `Cross-Origin-Opener-Policy`. Anything loaded from another origin (an embed, a script, an image) is blocked until the policy allows it. The policy isn't applied in `npm run dev`.
- **Code highlighting:** built-in Shiki with the minimal indigo theme in `src/lib/shiki-theme.ts` (see Code blocks above).
- **Download CV:** link the menu items to `/cv.pdf` and `/cv.md`; generate `/cv.md` at build time from the content and compute both sizes at build time.
