# eliasgarcia.dev: design specification

This is the source of truth for the site's design. It was produced in Claude Design and every rule here matches the approved canvas. Where this document and the reference HTML disagree, this document wins.

**How to use this package**

- `design/DESIGN.md` (this file): what to build and the rules it follows.
- `src/styles/tokens.css`: every colour, radius, motion and layer value. Never retype values. The type scale (§2.2) and spacing (§2.3) are added to it as tokens during setup.
- `design/reference/*.html`: static renders of every approved page and state, with the real CSS. Open them in a browser to compare, and read their CSS for exact details. They are reference, not source: rebuild them as Astro components rather than copying markup. Interactive behaviour (search, menus, filters) is described in this document because the static files cannot run it.
- `design/screenshots/`: every page at 1280px and 390px, in light and dark, plus the interactive states. Use them to check your output visually.
- `design/assets/`: logo, photos, share images (originals; the site uses copies in `src/assets/`). `design/head.html`: the `<head>` snippet for the app icons, which live in `public/`.
- `src/content/`: example content to seed the first version: YAML data (profile, work, talks, education) and posts and projects as MDX.

---

## 1. Principles

1. **One column, quiet by default.** A 688px column (640px of text plus 24px padding). Grey for context, near-black for the thing itself. No cards unless the content is something you can open.
2. **One of each.** Each job has exactly one component. If something new is needed, add it to the component list first; never create a variant inline.
3. **Indigo means state.** The accent marks the current page, the selected chip and links inside prose. Buttons stay neutral.
4. **Tokens only.** No raw colours, sizes or durations in components. Everything comes from `tokens.css`.
5. **A link only goes somewhere.** A row or card is a link only if it has a real destination; otherwise it renders as a plain, non-interactive row.
6. **Accessible and semantic first.** WCAG 2.2 AA in both themes, real HTML elements, keyboard paths for everything.

---

## 2. Foundations

### 2.1 Colour

The **zinc** and **indigo** palettes only, 14 tokens, each with a light and a dark value. Dark mode follows `prefers-color-scheme`; there is no manual toggle.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | white | zinc-950 | Page; also text on indigo fills and on dark popovers |
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
| `--tint-strong` | indigo-100 | indigo-900 | Search match highlight |
| `--accent-line` | indigo-300 | indigo-700 | Underline under links in prose |
| `--scrim` | zinc-950 at 18% | black at 55% | Behind the search dialog |

Rules:
- `--text-3` sits only on `--bg` or `--surface`, never on `--control` (4.4:1 in light mode, below AA).
- `--control-hover` and `--line` share a value today but are separate roles; never merge them.
- The header and status labels use `--bg` mixed with transparency (`color-mix(in oklch, var(--bg) 82%, transparent)` for the header), not new colours.
- In the canvas the accent token was named `--accent-c`; in code it is `--accent`.

### 2.2 Typography

One family, **Instrument Sans** (Google Fonts, via Astro's Fonts API), weights 400 / 500 / 600 only. Code uses the system monospace stack.

| Style | Size · weight · line height | Tracking | Use | Element |
|---|---|---|---|---|
| Display | 28 · 600 · 1.2 | −0.02em | Post and case study titles | `h1` |
| Page title | 20 · 600 · 1.35 | −0.01em | Home name, Projects, Writing, 404 | `h1` |
| Heading | 18 · 600 · 1.35 | −0.01em | Section headings in posts and case studies | `h2` |
| Lead | 18 · 400 · 1.6 | 0 | Case study intro | `p` |
| Long-form | 16 · 400 · 1.75 | 0 | Post and case study paragraphs | `p` |
| Body | 15 · 400/500 · 1.6 | 0 | Default text; list and card titles at 500 (1.35) | `p`, `h3` |
| Small | 14 · 400/500 · 1.6 | 0 | Descriptions; section labels at 500 | `p`, `h2` |
| Meta | 13 · 400 · 1.6 | 0 | Dates, captions, buttons, chips, footer | `time`, `figcaption` |
| Micro | 12 · 400/500 · 1.35 | 0 | Status labels, chip counts, footnote markers, key hints, menu descriptions | `span` |
| Code | 13 · 400 · 1.75 | 0 | Code blocks | `pre`, `code` |

Nothing a visitor reads is below 12px. Labels inside the decorative project illustrations (9–11px, one 22px number) are part of the drawings and hidden from screen readers.

Line heights are exactly five: 1 (single-line controls), 1.2, 1.35, 1.6, 1.75.

### 2.3 Spacing

A 4px grid. Every padding, margin, gap and offset is a multiple of 4. Only 1–2px hairlines sit off the grid.

| Value | Typical use |
|---|---|
| 4 | Title to the line below it, icon to label |
| 8 | Gaps inside controls; metadata dot gaps |
| 12 | List row padding, chip gaps, footer bar padding |
| 16 | Card and menu padding, gaps between cards |
| 20 | Prose block padding, facts row padding |
| 24 | Page side padding, gap after the 112px gutter, avatar to intro text |
| 32 | Between a page intro and its list (Home, Projects, Writing) |
| 40 | Between a post and its author footer |
| 48 | Top of every page on phones |
| 56 | Bottom padding of pages |
| 72 | Between Home sections |
| 80 | Top of every page (desktop) |
| 96 | Above the footer |

### 2.4 Radius

| Token | Value | Use |
|---|---|---|
| `--r-sm` | 4px | Search highlights, key hints, footnote markers, focus ring on text links |
| `--r-md` | 8px | Icon tiles, menu and search rows, popovers |
| `--r-lg` | 12px | Cards, previews, code blocks, menus, the search panel |
| `--r-full` | 999px | Buttons, chips, status labels |

Circles (avatar, dots) use 50%. The keyboard focus ring follows the shape of whatever is focused.

### 2.5 Motion

Three durations, two curves. Interface feedback never takes longer than 250ms.

| Token | Value | Use |
|---|---|---|
| `--dur-fast` | 100ms | Press feedback, search row highlight |
| `--dur` | 150ms | Hover, colour and opacity, popovers, Download CV menu |
| `--dur-slow` | 250ms | Page entrance, expanding rows, underline growing |
| `--ease` | ease-out | Default for everything |
| `--ease-settle` | cubic-bezier(.22, 1, .36, 1) | Things arriving: the page, menus, expanding rows |

The motion system:
1. **Page entrance.** The header never moves. `main` and the footer arrive as one piece: opacity 0→1 and translateY 6px→0 over 250ms with `--ease-settle`. No stagger, no scroll reveals.
2. **Between pages.** Cross-document View Transitions (`@view-transition { navigation: auto; }`); the header keeps its place (`view-transition-name: site-header`), the old content fades out in 100ms, then step 1 plays. The Roleburn preview (Home tile and Projects card) morphs into the case study hero (shared `view-transition-name: roleburn-preview`, 400ms). This needs a multi-page site, which Astro builds by default.
3. **Interaction.** Press scales to .97. Nothing animates from scale(0); popovers grow from their trigger (`transform-origin` at the trigger).
4. **Touch.** Hover movement and list dimming run only on real pointers: wrap them in `@media (hover: hover) and (pointer: fine)`. A tap must never leave rows dimmed.
5. **Reduced motion.** Gentler, not zero: pages fade in over 150ms without moving; everything that moves becomes instant; the analog-style loops in illustrations stop.

Deliberate exceptions: the Roleburn morph (400ms), the easing demo in the post (600ms), and the slow loops inside project illustrations.

### 2.6 Elevation and layers

One shadow, `--shadow-overlay`, for things that float (search dialog, Download CV menu). Everything else is flat and separated by borders.

| Layer | z-index | Use |
|---|---|---|
| content | 2, 5 | Local stacking inside a component |
| `--z-header` | 10 | Sticky header, reading progress bar |
| `--z-menu` | 30 | Download CV menu and its click-away layer; footnote panel on phones |
| `--z-dialog` | 50 | Search dialog and its backdrop |
| `--z-skip` | 100 | Skip link |

### 2.7 Icons

Two sizes, one weight: 1.5px stroke, round caps and joins, `currentColor`.

| Token | Size | Use |
|---|---|---|
| `icon-md` | 16px | Icons on their own or in a control: buttons, search result tiles, menu items, header search |
| `icon-sm` | 12px | The two inline markers, 4px from their word: the see-more chevron and the external-link arrow. Never a tap target on their own |

Icons always sit next to a text label, or carry an accessible name when alone. Decorative icons get `aria-hidden="true"`. Note: inside `.button`, the RSS icon's dot is filled; give any other icon's circles `fill: none` explicitly.

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

One breakpoint: **640px**. At ≤640px:
- the header search shows only its icon (no "⌘K");
- pages start 48px below the header instead of 80px;
- the footer drops the offset ("· 5h ahead of you") and keeps one row;
- the Home avatar is 80px and sits above the intro text;
- work rows put the + beside the date and the company/role below;
- the post meta uses the short date ("Nov 9, 2026");
- footnotes open as a panel pinned 24px above the bottom edge, inside the page margins.

---

## 3. Components

Each component appears exactly once in the design system. Live versions: `reference/components.html` and `screenshots/components.png`.

### Layout
- **Header.** Sticky, 64px, translucent `--bg` with backdrop blur, hairline at the bottom. Logo (links Home) · Home · Projects · Writing · search button (magnifier + "⌘K", icon only on phones). The current section is `--accent` with a 1px underline; inside a case study or post, its parent (Projects/Writing) is current with `aria-current="true"`; on the page itself `aria-current="page"`. Same on every page.
- **Footer.** Mirrors the header: 64px bar, hairline on top, content centred; grows only if the two halves wrap. Left: logo + "Elías García, 2026". Right: `<time>12:09</time> in Portugal · 5h ahead of you`. 96px above it; at the bottom of the window on short pages (`.site` is a flex column with `min-height: 100vh`, `main` flexes). Pad the bottom with `env(safe-area-inset-bottom)`.
- **Footer clock.** Portugal time via `Intl.DateTimeFormat(…, { timeZone: 'Europe/Lisbon' })`, refreshed every 30s. The offset compares with the visitor's clock, rounded to 15 minutes: "same time as you", "5h ahead of you", "5h 30m behind you". Render it client-side. The site is static, so the HTML ships without a time ("Portugal" only) and the script adds it. Hidden on phones.
- **Skip link.** "Skip to content", hidden until the first Tab, then a dark pill at the top left; jumps to `#content` (or `#top` on Home).

### Actions
- **Button.** The only action component. 32px, `--control` fill, `--r-full`, 13px label in `--text-2`, optional 16px icon, 8px gap, 12px side padding. Hover `--control-hover`; press scale .97. Never indigo. On a grey surface (the code block) its fill turns `--bg`. Uses: Download CV, Subscribe (Writing), Copy page (posts), Replay and Copy (inside posts).
- **Menu button: Download CV.** Label + chevron (no leading icon); the chevron rotates 180° while open. Opens a 320px menu under the button (`--r-lg`, `--shadow-overlay`, scale .97→1 from the top-left over 150ms). Two `role="menuitem"` rows in the search-row style: **PDF · 120 KB**, "Formatted for reading, printing and sharing" and **Markdown · 4 KB**, "Plain text for AI tools and agents". Opens on click, ↓ or ↑; arrows move, Home/End jump, Esc or click outside closes and returns focus to the button; Tab closes. File sizes are placeholders: compute them at build time.
- **Chip.** A set of choices that filters a list (Writing topics). 32px, `--control`, label + count badge. Selected (`aria-pressed="true"`): `--tint` fill, `--accent` label, count badge `--accent` fill with `--bg` text. Never alone, never for actions. "All" first and selected on load.
- **See-more link.** Muted 14px text + 12px chevron; on hover the text darkens, an underline grows left→right and the chevron nudges 2px. Only for pages inside the site ("All projects", "All posts", "Read the case study").
- **Back link + Copy page.** Top of posts: "‹ Writing" on the left, **Copy page** button on the right with the Markdown mark icon; label changes to "Copied" for 1.5s; `aria-label="Copy page as Markdown"`. Copies the post's Markdown (generate it at build time from the MDX).
- **External-link arrow.** A 12px arrow icon (`M4.5 3.5h4v4M8.5 3.5l-5 5`), 4px after the word, `--text-3` stroke, link colour on hover and a 1px up-right nudge (pointer devices only). Only on standalone links that leave the site: contact rows, the course row, project facts. Links inside prose never get it. Screen readers hear only the link text.

### Lists and cards
- **List row.** 112px date gutter (`<time>` in `--text-3`), title 15/500, one 14px line in `--text-2`, 12px vertical padding, no dividers. Rows are `<li>` in a `<ul role="list">`. When one row is hovered, other link rows fade to .45 (pointer devices only). **A row is a link only if it has somewhere to go; otherwise it is a plain row**: not an `<a>`, no hover, not focusable.
- **Expandable row (work experience).** A `<button class="jobhead" aria-expanded>` with date, company (500) + role, and a + icon that rotates to ×. The body opens with `grid-template-rows: 0fr → 1fr` (250ms) and lists the bullets. Layout is a grid: `112px 1fr auto` on desktop; on phones `"date icon" / "text text"` so the + stays beside the date. Only one open at a time. **Vesu is open on load**, the rest closed.
- **Project tile (Home).** Preview (4:3, `--surface`, `--line` border, `--r-lg`) with a status label, then title (`h3`) and one line. Three tiles in a row; `grid-template-rows: subgrid` keeps titles aligned. Lifts 2px on hover (pointer only).
- **Project card (Projects).** Bigger preview, title (`h2`), description, tags as plain comma-separated text, optional "Read the case study". When the count is odd the newest spans the full width (16:7 preview). Uses subgrid for alignment.
- **Status label.** Small static white label on a preview's corner: "In progress", or "In progress, 2026" on Projects. 12px, never clickable.
- **Previous / next card.** Bordered, `--r-lg`; the chevron sits on the side it leads to. In a `<nav aria-label="More posts">` (or "More projects").

### Text and metadata
- **Metadata line.** Items separated by a dot: each dot is its own `aria-hidden` element with an 8px gap on each side (never a dot between plain spaces). On wrapping, a dot stays with the item after it, so a line never ends on a dot. Post header: "November 9, 2026 · Design engineering · 4 min read"; the topic links to Writing filtered by it.
- **Project facts.** `<dl>`: **Year · Status · Links** in three equal columns between two hairlines; on phones Year and Status share a row and Links spans the full width. Links are named by destination ("Website", "GitHub", "npm"), product first, code second, with the external arrow; none → "Not public yet" in `--text-3`.
- **Author footer.** Ends every post: 40px photo, name (`rel="author"`, links Home) and role, inside the article's `<footer>` / `<address>`.

### Prose (MDX mapping)
These are what Markdown elements map to in posts and case studies:

| Markdown | Component | Notes |
|---|---|---|
| `## h2` | Heading | 18/600, an extra 24px above (on top of the paragraph gap); a `#` anchor link appears on hover and on keyboard focus, 24px to the left |
| `p` | Paragraph | 16/1.75 in posts, `--text-2` |
| `[a](…)` | Prose link | `--accent`, 1px `--accent-line` underline at 3px offset; solid and 2px on hover/focus. No arrow, even for external links |
| footnote `[^1]` | Footnote | 20px round marker (12px text); hover/focus shows a dark popover (`--text` bg, `--bg` text, 280px) above the marker; on phones a panel pinned to the bottom |
| ` ```lang ` | Code block | `--surface`, `--line` border, `--r-lg`, 20px padding, 13/1.75 mono, horizontal scroll inside the block (focusable `role="region"` with a label), Copy button top right |
| image | Figure | `<figure>` + `<figcaption>` (13px `--text-3`), image `--r-lg` |
| `ul` / `ol` | List | Not used in posts yet: when needed, reuse the work-row bullet style (4px round dot in `--text-3`, 16px indent) at long-form size |

Custom MDX components: `<EasingDemo />` (two runners, linear vs ease-out, 600ms, Replay button), `<RoleburnHero />` (the animated radar illustration, decorative, `aria-hidden`), `<Figure />`.

### Search dialog (⌘K)
- Opens with ⌘K / Ctrl+K and from the header button. A modal `role="dialog"` with `aria-modal="true"` with a 56px input row, a listbox of grouped results and a footer of key hints. **While open, the page behind does not scroll** (`html:has(.scrim) { overflow: hidden }` or equivalent).
- **Empty state:** Go to (Home, Projects, Writing) and Actions (Send me an email, Download CV, Subscribe with RSS).
- **Typed:** matches posts and projects; matching text highlighted with `--tint-strong`.
- **Rows:** 32px icon tile, title, one line, meta on the right; the active row is `--tint` with a ↵ hint. ↑↓ move, ↵ opens, Esc closes.
- **Nested choice:** "Download CV" shows › instead of ↵; Enter shows a crumb "Download CV" in the input and the same two formats (PDF / Markdown with descriptions and sizes). Esc or Backspace on an empty input goes back; a second Esc closes.
- **No results:** a short message above the list ("No posts or projects about “x” yet" / "Try a topic I write about, or suggest this one."), then normal rows: **Topics** (each with its post count; Enter re-runs the search) and **Suggest** ("Suggest “x” as a post", opens an email with "Post idea: x" as subject). Footer shows "0 results". Never a dead end.
- Index: a small JSON index built from the content collections at build time and fetched when the dialog first opens.

### Key hint
20px square, 12px text, `--line` border, `--r-sm`, never focusable: ↑ ↓ ↵ esc.

---

## 4. Pages

Screenshots for each: `screenshots/<page>.{desktop,phone}.{light,dark}.png`.

### Home (`/`)
1. **Intro.** Avatar (104px; 80px on phones, above the text), name (page title, `h1`), "Software engineer", then **Download CV** menu button and "Open to remote roles" with an indigo dot.
2. **About.** Two paragraphs.
3. **Projects.** Three tiles + "All projects ›".
4. **Work experience.** Five expandable rows, Vesu open.
5. **Writing.** The three newest posts as list rows (date "Nov 2026") + "All posts ›".
6. **Speaking and teaching.** The Lisbon photo with caption, then: three talks as **plain rows** (no recordings exist) and the course, "The DeFi revolution", as the one link (to balio.app, with the arrow), line "Online course in Spanish, Balio · 30 lessons".
7. **Education.** One plain row.
8. **Contact.** `<address>` with a `<dl>`: Email, GitHub, LinkedIn, X, each value a link with the arrow.

Sections are `<section aria-labelledby>` with 14/500 `h2` labels, 72px apart; the intro is a `<header>`.

### Projects (`/projects`)
Intro (title, one line), then the card grid (odd count: newest spans the full width). Roleburn has "Read the case study ›".

### Case study (`/projects/roleburn`)
Back link "‹ Projects", title (display) and lead, project facts, the hero illustration (shared view-transition name with the Projects preview), then the article: Why I built it, How it works (with a folder-tree code block and a placeholder figure), What's next; previous/next at the end.

### Writing (`/writing`)
Intro with **Subscribe** (RSS icon + label) on the right of the title; topic chips (All, AI, DeFi, Design engineering, with counts); posts grouped by year (`h2`), each an `<article>` in an `<li>` with `<time>`, `h3` title link, description, and "Topic · N min read" (the topic is plain text, not a link, because the row is already a link). The selected topic belongs in the URL (`?topic=ai`) so filtered views can be shared; announce the result count in a live region.

### Post (`/writing/<slug>`)
Back link + Copy page, title (display), metadata line, then the article (max 640px, long-form text), a reading-progress bar under the header (scroll-driven animation where supported), the author footer and previous/next.

### 404
"404" (meta), "Page not found" (page title), one sentence, then "Try one of these" as list rows with the path in the gutter ("/", "/projects", "/writing"), and "Followed a link here? **Email me** the address and I'll fix it." (mailto with subject "Broken link"; in the real build, prefill the body with the requested URL). No separate search button: the header search is enough.

### Share images (Open Graph, 1200×630)
`assets/share-site.png` and `assets/share-post.png`, templates in `reference/share-*.html`. Always light theme. Top: logo (+ "Elías García · Writing" on posts); middle: photo + name + title, or the post title at 72px; bottom: details on the left, eliasgarcia.dev on the right, dots spaced 16px. No time-sensitive status on them. Generate one per post at build time in a static endpoint, with Satori and sharp.

---

## 5. Content and copy rules

- Plain English, sentence case, short sentences. All titles in English; a source in another language is translated and its language noted ("Online course in Spanish").
- Dates: "Nov 9" in lists, "Nov 2026" on Home, "November 9, 2026" in post headers ("Nov 9, 2026" on phones). Always in `<time datetime>`.
- Separators: "·" as its own element with 8px gaps. Ranges use an en dash: "2024–Now".
- Typographic quotes and apostrophes (’ “ ”) in visible text.
- No mention of read.cv anywhere.
- Placeholder content still to replace is listed in `PLAN.md`. Until a destination exists, render rows and cards as plain (not links).

---

## 6. Accessibility and semantic HTML

Every page must pass axe (WCAG 2.2 AA + best practice) in light and dark, at 1280, 390 and 320px, with no horizontal scroll.

- Landmarks: one `<header>`, `<nav aria-label="Main">`, `<main id="content">`, `<footer>`. One `h1` per page, no skipped heading levels.
- Lists are `<ul role="list">` (role keeps semantics in Safari with `list-style: none`). Dates are `<time>`. Contact is `<address>` + `<dl>`. Page intros are `<header>` inside `main`, not labelled sections.
- Every interactive element is a real `<a>` or `<button>`; menus use `aria-haspopup`, `aria-expanded`, `aria-controls`; chips use `aria-pressed`; the search uses `role="dialog"`, `aria-modal`, a combobox input and `aria-activedescendant`.
- Visible focus: 2px `--accent` outline, 3px offset, following the element's shape (text links get `--r-sm`).
- Touch: 44px hit areas on `pointer: coarse` without changing visuals.
- Decorative illustrations are `aria-hidden`; their captions describe them. Rejected listings fading in the Roleburn hero are exempt decorative text.
- Scrollable code blocks are focusable regions with a label.
- `lang` on the document; mark any phrase in another language with `lang`.

---

## 7. Agents, SEO and sharing

- **`.md` for posts only.** A static endpoint `/writing/<slug>.md` per post, generated from the same MDX with custom components stripped; `<link rel="alternate" type="text/markdown">` on each post. Other pages have no `.md` version.
- **Copy page** on posts copies the same Markdown.
- **JSON-LD.** `Person` on Home (name, jobTitle, sameAs GitHub/LinkedIn/X, address country PT); `BlogPosting` on posts (author, datePublished, about/topic).
- **RSS** via `@astrojs/rss`; style the feed with an XSLT so clicking Subscribe shows a readable page. **Sitemap** via `@astrojs/sitemap`. **robots.txt** explicitly allows AI crawlers (GPTBot, ClaudeBot, PerplexityBot…).
- **App icons and head:** `design/head.html`.

---

## 8. Build notes (Astro)

- **Astro 7**, static output, multi-page (needed for cross-document View Transitions). Interactivity is small vanilla scripts; no UI framework and no `<ClientRouter />`.
- **Markup.** Where §3 and §6 name elements for interactive components (the work-row button, `role="dialog"`), they describe behaviour and semantics. `CLAUDE.md` decides the elements: native `<details>`, `<dialog>` and `popover` where they can match the design.
- **Content collections** with Zod schemas, all in `src/content/`: `writing` (MDX: title, description, date, topic, draft) and `projects` (MDX: title, summary, description, status, year, links[], tags[]; the body is the case study), loaded with `glob()`; `site` (single `profile` entry), `work`, `talks` and `education` from YAML files with `file()`. Reading time and whether a project has a case study are derived, not stored; reading time comes from a Sätteri plugin (Astro's reading-time recipe).
- **MDX** via `@astrojs/mdx`, with a components map for the Prose table above.
- **Code highlighting:** built-in Shiki with its `css-variables` theme, with the `--astro-code-*` variables set from tokens so dark mode follows automatically. The design is deliberately two-tone: code in `--text-2`, comments in `--text-3`; optionally keywords in `--accent`.
- **Scripts:** search dialog, Download CV menu, work rows, topic chips, easing demo, copy buttons, footer clock. Everything else ships as plain HTML.
- **Fonts:** Astro Fonts API for Instrument Sans (400–600), `display: swap`.
- **Download CV:** link the menu items to `/cv.pdf` and `/cv.md`; generate `/cv.md` at build time from the content and compute both sizes at build time.

---

## 9. File index

```
CLAUDE.md                       instructions for Claude Code
PLAN.md                         build order and open items (temporary)
design/DESIGN.md                this specification
design/reference/*.html         static renders of every page and state
design/screenshots/*.png        1280px and 390px, light and dark, plus states
design/assets/                  logo.svg (themed), avatar.jpg, speaking-lisbon-2023.jpg, share images
design/head.html                <head> snippet for the app icons
public/                         favicon.svg/.ico, apple-touch-icon, PWA icons, site.webmanifest, cv.pdf
src/assets/                     logo, avatar and speaking photo used by the site
src/styles/tokens.css           CSS variables (light + dark)
src/content/site.yaml           profile: identity, about, contact, speaking photo
src/content/work.yaml           jobs
src/content/talks.yaml          talks and the course
src/content/education.yaml      education
src/content/writing/*.mdx       one file per post (only "Rebuilding this site" is written; the rest are drafts)
src/content/projects/*.mdx      one file per project; the body is the case study
```
