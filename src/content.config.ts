import { defineCollection, type SchemaContext } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { entryFolders } from "./lib/entries.ts";
import { topicSlug } from "./lib/topics.ts";

const link = z.object({
  label: z.string(),
  href: z.url(),
});

// A content template that must hold each of these placeholders.
const template = (...placeholders: readonly string[]) =>
  z.string().superRefine((text, context) => {
    for (const placeholder of placeholders) {
      if (!text.includes(placeholder)) {
        context.addIssue({
          code: "custom",
          message: `Missing the ${placeholder} placeholder.`,
        });
      }
    }
  });

const site = defineCollection({
  loader: file("src/content/site.yaml"),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    city: z.string(),
    // An ISO 3166 code ("PT"): the name comes from Intl. The footer clock says
    // the time "in {country}", where the timezone is.
    country: z.string().regex(/^[A-Z]{2}$/),
    timezone: z.string(),
    // Shows "Open to work" on Home.
    openToWork: z.boolean(),
    about: z.array(z.string()),
    contact: z.array(link.extend({ text: z.string() })),
    // Every page's browser title but Home's, which is the name alone.
    pageTitle: template("{page}", "{name}"),
    feedTitle: template("{name}", "{page}"),
    cvTitle: template("{name}"),
    shareAlt: template("{name}", "{role}"),
  }),
});

// Every Home section but Writing is a folder of MDX files, one per entry:
// the frontmatter holds the facts, the body is the description (DESIGN.md §8,
// Content collections), which holds paragraphs, lists, bold, italic and
// links only (src/lib/mdast-entry-description.ts).

// "2024" or "2024-01". YAML reads a bare 2024 as a number, so it's read as
// text first.
const month = z.coerce
  .string()
  .regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/, { error: "Use YYYY or YYYY-MM." });

// A page on this site ("/writing/…") or on another (https://…).
const entryLink = z.union([
  z.url({ protocol: /^https$/ }),
  z.string().startsWith("/"),
]);

const shared = (image: SchemaContext["image"]) => ({
  title: z.string().min(1),
  // The grey line: a job title, a venue, a course's provider, a school.
  subtitle: z.string().optional(),
  images: z
    .array(z.object({ src: image(), alt: z.string().min(1) }))
    .min(1)
    .max(3)
    .optional(),
  // A card linking to another page (DESIGN.md, Link attachment). Its title,
  // image and site name come from that page, saved by `npm run previews`;
  // set them here only to replace the page's own.
  attachment: z
    .object({
      href: z.url({ protocol: /^https$/ }),
      title: z.string().optional(),
      image: image().optional(),
      site: z.string().optional(),
    })
    .optional(),
});

// Checked last: Zod can't extend a schema once it has a refinement.
const imagesOrAttachment = (data: { images?: unknown; attachment?: unknown }) =>
  data.images === undefined || data.attachment === undefined;
const notBoth = {
  error: "An entry has images or an attachment, not both.",
  path: ["attachment"],
};

const range = { start: month, end: z.union([month, z.literal("now")]) };

const endsAfterStart = (data: { start: string; end: string }) =>
  data.end === "now" || data.end >= data.start;
const endBeforeStart = {
  error: "The end is before the start.",
  path: ["end"],
};

const section = <Schema extends z.ZodType>(
  folder: (typeof entryFolders)[number],
  schema: (context: SchemaContext) => Schema,
) =>
  defineCollection({
    loader: glob({ pattern: "*.mdx", base: `./src/content/${folder}` }),
    schema,
  });

// Projects, talks and courses: one date and an optional link.
const dated = ({ image }: SchemaContext) =>
  z
    .object({ date: month, link: entryLink.optional(), ...shared(image) })
    .strict()
    .refine(imagesOrAttachment, notBoth);

// A job's head opens it, so it has no link. Its place is "Remote", or how
// and where ("On-site, A Coruña").
const work = section("work", ({ image }) =>
  z
    .object({ ...range, place: z.string().min(1), ...shared(image) })
    .strict()
    .refine(imagesOrAttachment, notBoth)
    .refine(endsAfterStart, endBeforeStart),
);

const education = section("education", ({ image }) =>
  z
    .object({ ...range, link: entryLink.optional(), ...shared(image) })
    .strict()
    .refine(imagesOrAttachment, notBoth)
    .refine(endsAfterStart, endBeforeStart),
);

const projects = section("projects", dated);
const speaking = section("speaking", dated);
const teaching = section("teaching", dated);

// What each attachment's page says about itself when shared, keyed by its
// address. Written by `npm run previews` (scripts/previews.ts), never by hand.
const linkPreviews = defineCollection({
  loader: file("src/content/link-previews.json"),
  schema: ({ image }) =>
    z.object({
      title: z.string().optional(),
      image: image().optional(),
      siteName: z.string().optional(),
      type: z.string().optional(),
    }),
});

const cvFormats = defineCollection({
  loader: file("src/content/cv-formats.yaml"),
  schema: z.object({
    label: z.string(),
    keywords: z.array(z.string()).default([]),
    description: z.string(),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    topic: z.string().transform((label) => ({ label, slug: topicSlug(label) })),
    draft: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  loader: file("src/content/pages.yaml"),
  schema: z.object({
    title: z.string(),
    intro: z.string(),
  }),
});

const notFound = defineCollection({
  loader: file("src/content/not-found.yaml"),
  schema: z.object({
    label: z.string(),
    title: z.string(),
    intro: z.string(),
    introWithAddress: template("{address}"),
    suggestionsTitle: z.string(),
    suggestions: z.record(z.string(), z.string()),
    report: template("{link}"),
    reportLink: z.string(),
    reportSubject: z.string(),
    reportBody: template("{url}", "{referrer}"),
  }),
});

const post = defineCollection({
  loader: file("src/content/post.yaml"),
  schema: z.object({
    readingTime: template("{minutes}"),
    copyPage: z.string(),
    copyPageName: z.string(),
    copyCode: z.string(),
    codeName: template("{language}"),
    plainCodeName: z.string(),
    copyCodeName: template("{language}"),
    copied: z.string(),
    copyFailed: z.string(),
    topicName: template("{topic}"),
    more: z.string(),
    previous: z.string(),
    next: z.string(),
    footnotes: z.string(),
    footnoteName: template("{number}"),
    sectionLink: z.string(),
    tableName: z.string(),
    callout: z.string(),
    replay: z.string(),
  }),
});

const counts = z.object({
  one: template("{count}"),
  other: template("{count}"),
});

const layout = defineCollection({
  loader: file("src/content/layout.yaml"),
  schema: z.object({
    skip: z.string(),
    navName: z.string(),
    homeName: template("{name}"),
    homeLabel: z.string(),
    newTab: z.string(),
    clock: template("{time}", "{country}"),
    sameTime: z.string(),
    ahead: template("{amount}"),
    behind: template("{amount}"),
  }),
});

const home = defineCollection({
  loader: file("src/content/home.yaml"),
  schema: z.object({
    role: template("{role}", "{city}", "{country}"),
    about: z.string(),
    work: z.string(),
    projects: z.string(),
    speaking: z.string(),
    teaching: z.string(),
    education: z.string(),
    contact: z.string(),
    downloadCv: z.string(),
    openToWork: z.string(),
    allPosts: z.string(),
    degree: template("{title}", "{school}"),
    present: z.string(),
    experience: z.string(),
  }),
});

const writingIndex = defineCollection({
  loader: file("src/content/writing-index.yaml"),
  schema: z.object({
    subscribe: z.string(),
    filterName: z.string(),
    all: z.string(),
  }),
});

const viewer = defineCollection({
  loader: file("src/content/viewer.yaml"),
  schema: z.object({
    close: z.string(),
    previous: z.string(),
    next: z.string(),
    open: template("{index}", "{count}", "{title}"),
    openOne: template("{title}"),
    label: template("{index}", "{count}", "{title}"),
    labelOne: template("{title}"),
    position: template("{index}", "{count}"),
    hints: z.object({
      previous: z.string(),
      next: z.string(),
      move: z.string(),
      escape: z.string(),
      close: z.string(),
    }),
  }),
});

const search = defineCollection({
  loader: file("src/content/search.yaml"),
  schema: z.object({
    button: z.string(),
    shortcut: z.string(),
    shortcutOther: z.string(),
    dialog: z.string(),
    // The second for a site with no posts (DESIGN.md §8), like noResults.
    input: z.object({
      label: z.string(),
      labelNothing: z.string(),
    }),
    clear: z.string(),
    results: z.string(),
    goTo: z.string(),
    sections: z.record(z.string(), z.string()),
    actions: z.string(),
    email: z.string(),
    cv: z.object({
      line: z.string(),
      placeholder: z.string(),
      noMatch: template("{query}"),
      back: z.string(),
    }),
    rss: z.object({ title: z.string(), line: z.string() }),
    noResults: z.object({
      title: template("{query}"),
      titleNothing: template("{query}"),
      hint: z.string(),
      hintWithoutPosts: z.string(),
    }),
    topics: z.string(),
    suggest: z.string(),
    suggestion: z.object({
      title: template("{query}"),
      line: z.string(),
      subject: template("{query}"),
    }),
    hints: z.object({
      escape: z.string(),
      move: z.string(),
      open: z.string(),
      back: z.string(),
    }),
    resultCount: counts,
    postCount: counts,
  }),
});

export const collections = {
  site,
  pages,
  notFound,
  layout,
  home,
  writingIndex,
  search,
  viewer,
  post,
  work,
  projects,
  speaking,
  teaching,
  education,
  linkPreviews,
  cvFormats,
  writing,
};
