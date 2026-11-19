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
        .array(z.object({ src: image(), full: image(), alt: z.string() }))
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

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    description: z.string(),
    illustration: z.enum(["roleburn", "work-issue", "pol-funding-spreads"]),
    status: z.enum(["In progress", "Experiment", "Research"]),
    year: z.number().int(),
    links: z.array(link),
    // A draft case study shows in `npm run dev` only; the project still lists.
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

const counts = z.object({
  one: template("{count}"),
  other: template("{count}"),
});

const post = defineCollection({
  loader: file("src/content/post.yaml"),
  schema: z.object({
    readingTime: template("{minutes}"),
  }),
});

const share = defineCollection({
  loader: file("src/content/share.yaml"),
  schema: z.object({
    sections: z.array(z.string()).nonempty(),
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
      title: z.string(),
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
  search,
  viewer,
  post,
  share,
  work,
  talks,
  courses,
  education,
  cvFormats,
  writing,
  projects,
};
