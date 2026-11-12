# CLAUDE.md

Personal site of Elías García at eliasgarcia.dev: Home, Projects with case studies, and a blog (Writing). The design is finished and approved; build it faithfully.

## Sources of truth

- `design/DESIGN.md`: the specification. Read it before any UI work. `design/screenshots/` and `design/reference/*.html` show the expected result; rebuild as components, never paste their markup. `design/` is reference only: the site never imports from it.
- `src/styles/tokens.css`: all design values.
- `PLAN.md`: build order, notes for the next steps and open items for the redesign. Temporary.
- The `modern-web-guidance` skill: general web platform practice (HTML, CSS, accessibility, performance). This file does not repeat it.
- The Astro docs, through the `astro-docs` MCP server. Astro changes between major versions: check the docs before using an Astro API.

When they disagree, `DESIGN.md` wins on design, this file wins on engineering and tooling, and both win over the skill. When anything is ambiguous or missing, ask; never assume.

Markup follows the HTML specification, even where the reference HTML does something else: keep the design's look, not its markup.

**Browser support:** newer web features are fine as progressive enhancement. The site must work without them. No polyfills.

## Stack

- Astro 7 with static output, TypeScript (`astro/tsconfigs/strictest`), MDX, plain CSS with no framework.
- ESLint, Prettier, Playwright + axe, Lighthouse CI.
- Node 24, pinned with `engines.node`.
- Vercel through Git: `main` deploys to production (`eliasgarcia.dev`), other branches get previews. The build is plain static files in `dist/`, with no adapter.

## Verify before finishing

`npm run format && npm run lint && npm run build && npm run a11y`

`build` type-checks with `astro check`; `a11y` runs axe on every page and state, in both themes and at three widths.

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
public/         # files served as-is (icons, manifest, cv.pdf, robots.txt)
design/         # design handoff (reference only)
```

- Static first, and readable without JavaScript: scripts enhance HTML that already works. Use native elements (`<details>`, `<dialog>`, `popover`) where they can match the design; where they can't, content renders visible and the script collapses it.
- Interactivity is a vanilla `<script>` in its component, finding its elements through `data-*` attributes. No custom element classes and no UI framework. Scripts that must set page state before the first render are tiny `is:inline` scripts in `<head>` that fall back cleanly without the API.
- Page transitions are the browser's cross-document View Transitions, in CSS. Never add `<ClientRouter />`.
- The build is a snapshot. Never render the current time, the current year or anything relative to "now" into HTML: ship a stable fallback and let a script fill it in.
- Every content file is a collection with a schema in `content.config.ts`. Use the generated types (`CollectionEntry<'writing'>`); don't redeclare them.
- Collections come back in no fixed order, so always sort: posts by date, newest first; everything else by year, newest first, then by title (for work and education the year is `start`).
- Generated files (CV, RSS, post Markdown…) are static endpoints in `src/pages/`.
- Images go through `astro:assets`. Component props are declared with `type Props`. Dates, money, units (like file sizes) and other locale-dependent values are formatted with `Intl`; plain counts are not.

## Design in code

- Tokens only: no raw colours, sizes, radii, durations or z-indexes in components. Font-size tokens are in `rem` (the design's px value divided by 16), and elements that hold text get a minimum size, not a fixed height.
- Styles live in each component's scoped `<style>`. Global CSS only for tokens, reset and base element styles.
- Check both themes for every change.
- Links to other websites and the RSS feed open in a new tab (`linkTarget()` in `src/lib/links.ts`). Pages on this site, downloads and `mailto:` links don't.

## Content

- `src/content/` is the single source of content. Never hardcode copy in components or duplicate it in another file. Each post or project is one file with its metadata in the frontmatter.
- Never store what can be derived, like topic counts, reading time or whether a project has a case study (it has a body).
- Topics are not case sensitive (`AI` and `ai` are one topic); the label is the newest post's spelling.
- Posts with `draft: true` show in `npm run dev` and are left out of the production build.
- `public/cv.pdf` is made by hand. When the work, talks or education content changes, say that the PDF needs updating too.
- Don't invent facts, numbers or links. Leave a clear TODO where something is missing.

## URLs

- No trailing slash, in pages and in internal links.
- Every page has a unique `<title>`, `<meta name="description">`, `<link rel="canonical">` and Open Graph tags, set through the base layout.

## Process

- Committing, pushing and deploying always need an explicit ask. Pushing to `main` deploys to production.
- Before committing, run `npm run lighthouse` (after `npm run build`) and the `reviewer` agent (`.claude/agents/reviewer.md`) on the changes. Fix every Lighthouse failure and every "must fix" finding, or explain why not.
- Conventional commits, one logical change per commit.
- New dependencies only when the task needs them. Always install the latest version.
- No secrets in the repo, and no third-party scripts without a clear reason.
