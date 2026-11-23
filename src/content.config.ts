import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
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
    availability: z.string(),
    about: z.array(z.string()),
    contact: z.array(link.extend({ text: z.string() })),
    // Every page's browser title but Home's, which is the name alone.
    pageTitle: template("{page}", "{name}"),
    feedTitle: template("{name}", "{page}"),
    shareAlt: template("{name}", "{role}"),
  }),
});

const job = z.object({
  start: z.number().int(),
  end: z.number().int().optional(),
  company: z.string(),
  about: z.string(),
  role: z.string(),
  points: z.array(z.string()),
});

const work = defineCollection({
  loader: file("src/content/work.yaml"),
  schema: z.discriminatedUnion("mode", [
    job.extend({ mode: z.literal("Remote") }),
    job.extend({ mode: z.enum(["On-site", "Hybrid"]), place: z.string() }),
  ]),
});

const talks = defineCollection({
  loader: file("src/content/talks.yaml"),
  schema: ({ image }) =>
    z.object({
      date: z.coerce.date(),
      title: z.string(),
      where: z.string(),
      photos: z
        .array(z.object({ src: image(), alt: z.string() }))
        .min(1)
        .max(3),
    }),
});

const courses = defineCollection({
  loader: file("src/content/courses.yaml"),
  schema: ({ image }) =>
    z.object({
      date: z.coerce.date(),
      title: z.string(),
      originalTitle: z.string().optional(),
      where: z.string(),
      href: z.url(),
      rating: z.object({
        score: z.number().min(0).max(5),
        reviews: z.number().int().positive(),
      }),
      lessons: z.number().int().positive(),
      minutes: z.number().int().positive(),
      video: link.extend({ thumbnail: image(), source: z.string() }),
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

const education = defineCollection({
  loader: file("src/content/education.yaml"),
  schema: z.object({
    start: z.number().int(),
    end: z.number().int(),
    title: z.string(),
    school: z.string(),
    detail: z.string(),
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

// A file whose name starts with "_" is a sample: it shows in `npm run dev`
// only.
const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      description: z.string(),
      // The project's picture, on its tile, its card and its case study.
      cover: z.discriminatedUnion("kind", [
        z.object({
          kind: z.literal("illustration"),
          name: z.enum(["roleburn", "work-issue"]),
        }),
        z.object({
          kind: z.literal("image"),
          src: image(),
          alt: z.string().min(1),
        }),
      ]),
      status: z.enum(["In progress", "Experiment", "Research"]),
      year: z.number().int(),
      links: z.array(link),
      // A draft case study shows in `npm run dev` only; the project still
      // lists.
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
    speaking: z.string(),
    teaching: z.string(),
    education: z.string(),
    contact: z.string(),
    downloadCv: z.string(),
    allProjects: z.string(),
    allPosts: z.string(),
    degree: template("{title}", "{school}"),
    present: z.string(),
    rating: template("{score}", "{reviews}"),
    reviews: template("{reviews}"),
    reviewCount: counts,
    lessonCount: counts,
    experience: z.string(),
  }),
});

const project = defineCollection({
  loader: file("src/content/project.yaml"),
  schema: z.object({
    view: z.string(),
    year: z.string(),
    status: z.string(),
    links: z.string(),
    noLinks: z.string(),
    more: z.string(),
    previous: z.string(),
    next: z.string(),
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
    input: z.string(),
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
      hint: z.string(),
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
  project,
  writingIndex,
  search,
  viewer,
  post,
  work,
  talks,
  courses,
  education,
  cvFormats,
  writing,
  projects,
};
