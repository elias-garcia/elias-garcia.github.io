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
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      location: z.string(),
      timezone: z.string(),
      availability: z.string(),
      about: z.array(z.string()),
      contact: z.array(link.extend({ text: z.string() })),
      speakingPhoto: z.object({
        src: image(),
        alt: z.string(),
        caption: z.string(),
      }),
    }),
});

const work = defineCollection({
  loader: file("src/content/work.yaml"),
  schema: z.object({
    start: z.number().int(),
    end: z.number().int().optional(),
    company: z.string(),
    about: z.string(),
    role: z.string(),
    points: z.array(z.string()),
  }),
});

const talks = defineCollection({
  loader: file("src/content/talks.yaml"),
  schema: z.object({
    year: z.number().int(),
    title: z.string(),
    originalTitle: z.string().optional(),
    where: z.string(),
    detail: z.string().optional(),
    href: z.url().optional(),
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
  }),
});

const pages = defineCollection({
  loader: file("src/content/pages.yaml"),
  schema: z.object({
    title: z.string(),
    intro: z.string(),
  }),
});

export const collections = {
  site,
  pages,
  work,
  talks,
  education,
  writing,
  projects,
};
