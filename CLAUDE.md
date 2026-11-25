# CLAUDE.md

Personal site of Elías García at eliasgarcia.dev: Home, Projects with case studies, and a blog (Writing). The design is finished and approved; build it faithfully.

## Sources of truth

- `design/DESIGN.md`: the specification. Read it before any UI work. `design/screenshots/` and `design/reference/*.html` show the expected result; rebuild as components, never paste their markup. `design/` is reference only: the site never imports from it.
- `src/styles/tokens.css`: the shared design values. A value only one component uses lives at the top of that component's styles.
- `PLAN.md`: build order, notes for the next steps and open items for the redesign. Temporary.
- The `modern-web-guidance` skill: general web platform practice (HTML, CSS, accessibility, performance). This file does not repeat it.
- The Astro docs, through the `astro-docs` MCP server. Astro changes between major versions: check the docs before using an Astro API.

When they disagree, `DESIGN.md` wins on design, this file wins on engineering and tooling, and both win over the skill. When anything is ambiguous or missing, ask; never assume.

Markup follows the HTML specification, even where the reference HTML does something else: keep the design's look, not its markup.

**Browser support:** newer web features are fine as progressive enhancement. The site must work without them. No polyfills.

## Stack

- Astro 7 with static output, TypeScript (`astro/tsconfigs/strictest`), MDX, plain CSS with no framework.
- Font: Inter through Astro's Fonts API (variable, upright and italic, without its optical-size axis; only the upright font is preloaded); static Inter files for the CV PDF.
- Icons: Tabler through `@tabler/icons-astro`, brand marks included.
- ESLint, Prettier, html-validate, Playwright + axe, Lighthouse CI.
- GitHub Actions: `ci.yml` runs every check on pull requests and on `main`, with Lighthouse and the internal links and anchors (lychee), then deploys; `links.yml` checks the links to other sites on the first of each month.
- Node 26, pinned with `engines.node`.
- Vercel hosts what GitHub Actions builds (`vercel deploy --prebuilt`): its own builds can't run Chrome, which prints the CV, so `vercel.json` turns off its Git deploys. Once the checks pass, a pull request gets a preview (GitHub shows it on the PR as a deployment to the `preview` environment) and `main` deploys to production (`eliasgarcia.dev`). The build is plain static files in `dist/`, with no adapter.

## Verify before finishing

`npm run format && npm run lint && npm test && npm run build && npm run html`

`test` runs the unit tests (`src/lib/*.test.ts`, Node's own test runner); `build` type-checks with `astro check`, prints the CV PDF (`npm run cv`, which needs Google Chrome) and builds the site; `html` validates the built pages against the HTML specification (html-validate's `standard` preset).

When a change touches what a visitor sees (markup, styles, content, an interactive state), also run `npm run a11y`: axe on every page and state, in both themes and at three widths.

CI runs all of these on every pull request, with the two checks that only run there: Lighthouse (`npm run lighthouse`, one run per page) and the internal links and anchors. Run Lighthouse here (after `npm run build`) only to look into a failure there.

## Principles

- Quality over speed. Choose the solution a careful senior engineer would approve in review, even when it takes longer. No shortcuts.
- No speculative design. Build for current requirements only: no abstractions, configuration or extension points "for later".
- Reuse before creating. Search for an existing component, layout, utility or style before writing a new one.
- No workarounds. Never use type assertions (`as X`; `as const` is fine), `!`, `any`, `@ts-ignore`, `@ts-expect-error` or `eslint-disable`, and never relax `tsconfig.json` or the ESLint config to make code pass. If blocked, stop and report.
- Functional only: no classes, no `this`. Use `type`, never `interface`, except in `src/env.d.ts` to extend Astro's HTML attribute types.
- No comments unless explaining a non-obvious why. Descriptive names, no abbreviations, no `_` prefixes.
- No `.js`, `.cjs` or `.mjs` files. TypeScript where supported, otherwise JSON or YAML.
- Everything in English: code, UI text, commits, docs.

## Architecture

```
src/
  assets/       # images processed by astro:assets
  components/   # .astro components, one per file, PascalCase; mdx/ holds the prose and MDX ones
  layouts/      # page shells
  pages/        # routes and static endpoints
  content/      # YAML data and MDX (writing/, projects/)
  lib/          # TypeScript utilities
  styles/       # tokens.css, global.css
  content.config.ts
public/         # files served as-is (icons, manifest; cv.pdf is printed there)
design/         # design handoff (reference only)
```

- Static first, and readable without JavaScript: scripts enhance HTML that already works. Use native elements (`<details>`, `<dialog>`, `popover`) where they can match the design; where they can't, content renders visible and the script collapses it.
- Interactivity is a vanilla `<script>` in its component, finding its elements through `data-*` attributes. What a script works out without the DOM (search matching, gesture maths) is a module in `src/lib/` with unit tests beside it. A concern that stands on its own (zoom, the status bar, the history entry) is a module there too. No custom element classes and no UI framework. Scripts that must set page state before the first render are tiny `is:inline` scripts in `<head>` that fall back cleanly without the API.
- Page transitions are the browser's cross-document View Transitions, in CSS. Never add `<ClientRouter />`.
- A Content-Security-Policy is on (`security.csp` in `astro.config.ts`, headers in `vercel.json`; DESIGN.md §8): anything loaded from another origin is blocked until the policy allows it. Astro hashes the scripts and styles it processes, not `is:inline` ones: those only run from `<head>`, ahead of the policy's `<meta>`, so never put one in the body. The policy isn't applied in `npm run dev`: check with a build.
- The build is a snapshot. Never render the current time, the current year or anything relative to "now" into HTML: ship a stable fallback and let a script fill it in.
- Every content file is a collection with a schema in `content.config.ts`. Use the generated types (`CollectionEntry<'writing'>`); don't redeclare them.
- Collections come back in no fixed order, so always sort: posts, talks and courses by date, newest first (then by title); everything else by year, newest first, then by title (for work and education the year is `start`), with projects in progress before the rest.
- Generated files (CV, RSS, post Markdown…) are static endpoints in `src/pages/`.
- Images go through `astro:assets`. Component props are declared with `type Props`. Dates, money, units (like file sizes) and other locale-dependent values are formatted with `Intl`; plain counts are not.

## Design in code

- Tokens only: no raw colours, sizes, radii, durations or z-indexes in a component's rules. Shared values come from `tokens.css`. A value only one component uses is a custom property declared at the top of that component's root rule (with a comment when its why isn't obvious) and used through `var()`; when a second component needs it, it moves to `tokens.css`. Three kinds of value stay in `tokens.css` even with one user: every colour, the members of a scale (type, spacing, the page's layers; stacking inside one component is declared there), and anything used outside the component's own subtree (a `::view-transition-*` pseudo-element, a value a script reads from the root). Font-size tokens are in `rem` (the design's px value divided by 16), and elements that hold text get a minimum size, not a fixed height.
- Type (DESIGN.md §2.2): 16px (`--text-body`) for everything you read or navigate with, on every page. Hierarchy comes from colour and weight first; size steps in only for page titles and inside posts. Never make a section heading bigger: the space above it does the separating. Six sizes (32 · 24 · 20 · 16 · 14 · 12), with 14 only for facts and compact controls, never as a second body size. Line heights: 1.6 for running text, 1.5 for single lines and small text. Two extra tokens: `--text-code` (14, its own token for code blocks) and `--text-figure` (22, outside the list, part of a case study hero's drawing). The 640px column sets the line length: never widen it or add a `max-width` in `ch`.
- Spacing (DESIGN.md §2.3): the ten steps (4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 80 · 96); 20 only as padding inside boxed components. Page-level gaps only through `--space-page`, `--space-section` and `--space-footer`, which step down on phones by themselves. The gaps between sections and blocks live on the parent (`gap` on a flex or grid container): headings and blocks carry no outer margins, except in prose, which uses its rhythm of margins. List rows keep their 12px padding as their hover area.
- Motion (DESIGN.md §2.5): two durations, `--dur-move` (250ms) for anything that opens or moves and `--dur-quick` (150ms) for anything that closes or leaves and for feedback (an element that opens and closes carries the quick one at rest and the move one when open), and two curves, `--ease-settle` for anything that enters, leaves or moves and `--ease` only for hover and colour. Nothing driven by the keyboard animates: search opens instantly, the Download CV menu opened with Enter or Space appears instantly, arrowing through rows highlights instantly, and the image viewer opens, closes and changes photo instantly from the keyboard. Hover never moves a card, and hover underlines fade in. Every pressable control has press feedback (.97 for buttons, .99 for bordered cards), and copy buttons keep their width: both labels share one grid cell and crossfade. Menus grow from their trigger with a transition and `@starting-style`, never keyframes. Gestures accept flicks, ignore a second finger, and set transforms on the moving element, never through a CSS variable on a parent. Animate transform and opacity (expanding rows excepted). Hover movement only under `(hover: hover) and (pointer: fine)`; honour `prefers-reduced-motion`.
- Phones (DESIGN.md §2.9): keep the viewport tag as it is (`viewport-fit=cover`, `interactive-widget=resizes-content`) and never disable zoom. Every hover style sits in `@media (hover: hover) and (pointer: fine)`; touch gets press states instead (no tap flash; text links and list rows dim while pressed), through `:active` alone: iOS applies it to a touch only under a touch listener, and we add none just for that, so on iPhones only text links dim. Use `100svh` for the page shell and `dvh` for open dialogs, never `100vh`. Pad for the notch with `env(safe-area-inset-*)` (`--page-start`, `--page-end`). Check on a real iPhone and Android phone: emulation hides all of this.
- Styles live in each component's scoped `<style>`. Global CSS only for tokens, reset and base element styles (the links' focus shape and the dialogs' shared shell are base styles).
- Icons are Tabler's (`@tabler/icons-astro`, DESIGN.md §2.7), drawn only by `Icon.astro`: `<Icon name="…" />` with the Tabler name. A new icon is a lookup on tabler.io/icons (a brand mark too: no second icon set), an import in `Icon.astro` and a row in §2.7's table; never draw one by hand or inline an `<svg>` in a component. Style an icon from its parent through a class.
- Check both themes for every change, and colour changes with forced colours emulated too (DESIGN.md §6): a state must never rely on a fill alone. System colour keywords (`CanvasText`, `Highlight`…) are the one exception to tokens only, and only inside `@media (forced-colors: active)`.
- Links to other websites and the RSS feed open in a new tab (`linkTarget()` in `src/lib/links.ts`). Pages on this site, downloads and `mailto:` links don't.

## Content

- `src/content/` is the single source of content. Never hardcode copy in components or duplicate it in another file. Each post or project is one file with its metadata in the frontmatter. Interface text lives there too, one file per part of the site, each read through its getter in `src/lib/content.ts`; sentences with a variable part are templates filled with `fill()`. The labels inside a drawing (the project covers, the Roleburn figure) are part of the drawing and stay in it.
- Never store what can be derived, like topic counts or reading time.
- Topics are not case sensitive (`AI` and `ai` are one topic); the label is the newest post's spelling.
- Empty sections aren't built: with no projects or no published posts, that section, its nav item, its pages, its search group and every link to it are left out (`hasProjects` / `hasWriting` in `src/lib/sections.ts`; the RSS feed stays). DESIGN.md §8.
- Posts and projects work the same way: each is one file with its page, and with `draft: true` it shows in `npm run dev` and is left out of the production build (its card, its page and every link to it). There's no other way to hide one: the prose reference post and the image-cover sample project are drafts.
- A project's cover (DESIGN.md, Project cover) is rendered by `ProjectCover` and named for the morph by `coverName()`: never type a `project-…` transition name by hand.
- `public/cv.pdf` is printed on every build (`npm run cv`) from `/cv/print`, a page built only for printing and in `npm run dev` (DESIGN.md, CV PDF), and isn't in git. `npm run dev` needs it once: run `npm run cv` after cloning. The print fails if the CV passes two pages, or if a parser can't read back the page's whole text, in order.
- Don't invent facts, numbers or links. Leave a clear TODO where something is missing.

## URLs

- No trailing slash, in pages and in internal links. Build the addresses of pages and generated files with `routes` (`src/lib/routes.ts`), never by hand.
- Every page has a unique `<title>`, `<meta name="description">`, `<link rel="canonical">` and Open Graph tags, set through the base layout.

## Process

- Committing, pushing and deploying always need an explicit ask. Pushing to `main` deploys to production.
- Before committing, run the `reviewer` agent (`.claude/agents/reviewer.md`) on the changes, unless the commit only changes documents (this file, `PLAN.md`) or `design/`. Fix every "must fix" finding, or explain why not.
- Changes reach `main` through a pull request, so CI has run on them, and CI runs again on `main` before it deploys.
- Conventional commits, one logical change per commit.
- New dependencies only when the task needs them. Always install the latest version.
- No secrets in the repo, and no third-party scripts without a clear reason.
