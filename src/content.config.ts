import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { topicSlug } from "./lib/topics.ts";

const link = z.object({
  label: z.string(),
  href: z.url(),
});

const site = defineCollection({
  loader: file("src/content/site.yaml"),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    city: z.string(),
    // The footer clock says the time "in {country}", where the timezone is.
    country: z.string(),
    timezone: z.string(),
    availability: z.string(),
    about: z.array(z.string()),
    contact: z.array(link.extend({ text: z.string() })),
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
    introWithAddress: z.string().includes("{address}"),
    suggestionsTitle: z.string(),
    suggestions: z.record(z.string(), z.string()),
    report: z.string().includes("{link}"),
    reportLink: z.string(),
    reportSubject: z.string(),
    reportBody: z.string().includes("{url}").includes("{referrer}"),
  }),
});

export const collections = {
  site,
  pages,
  notFound,
  work,
  talks,
  courses,
  education,
  writing,
  projects,
};
