import {
  getCollection,
  getEntry,
  render,
  type CollectionEntry,
  type CollectionKey,
} from "astro:content";
import { z } from "astro/zod";
import { compareText } from "./format.ts";
import type { Section } from "./navigation.ts";
import { routes } from "./routes.ts";
import { fill } from "./template.ts";

async function requireEntry<Collection extends CollectionKey>(
  collection: Collection,
  id: string,
) {
  const entry = await getEntry(collection, id);
  if (entry === undefined) {
    throw new Error(`The \`${collection}\` collection has no \`${id}\` entry.`);
  }
  return entry;
}

export async function getProfile() {
  const { data } = await requireEntry("site", "profile");
  return data;
}

function byYearThenTitle(
  a: { readonly year: number; readonly title: string },
  b: { readonly year: number; readonly title: string },
): number {
  return b.year - a.year || compareText(a.title, b.title);
}

export async function getWork() {
  const jobs = await getCollection("work");
  return jobs.sort(
    (a, b) =>
      b.data.start - a.data.start ||
      compareText(a.data.company, b.data.company),
  );
}

function byDateThenTitle(
  a: { readonly date: Date; readonly title: string },
  b: { readonly date: Date; readonly title: string },
): number {
  return b.date.valueOf() - a.date.valueOf() || compareText(a.title, b.title);
}

export async function getTalks() {
  const talks = await getCollection("talks");
  return talks.sort((a, b) => byDateThenTitle(a.data, b.data));
}

export async function getCourses() {
  const courses = await getCollection("courses");
  return courses.sort((a, b) => byDateThenTitle(a.data, b.data));
}

// "Remote", or the mode and the city, comma separated.
export function workMode(job: CollectionEntry<"work">["data"]): string {
  return job.mode === "Remote" ? job.mode : `${job.mode}, ${job.place}`;
}

export async function getEducation() {
  const degrees = await getCollection("education");
  return degrees.sort(
    (a, b) =>
      b.data.start - a.data.start || compareText(a.data.title, b.data.title),
  );
}

export async function getProjects() {
  const projects = await getCollection("projects");
  const inProgress = (project: CollectionEntry<"projects">) =>
    project.data.status === "In progress" ? 0 : 1;
  return projects.sort(
    (a, b) => inProgress(a) - inProgress(b) || byYearThenTitle(a.data, b.data),
  );
}

export function hasCaseStudy(project: CollectionEntry<"projects">): boolean {
  return (
    (import.meta.env.DEV || !project.data.draft) &&
    (project.body ?? "").trim() !== ""
  );
}

function byNewest(
  a: CollectionEntry<"writing">,
  b: CollectionEntry<"writing">,
): number {
  return b.data.date.valueOf() - a.data.date.valueOf();
}

export async function getPosts() {
  const posts = await getCollection(
    "writing",
    ({ data }) => import.meta.env.DEV || !data.draft,
  );
  return posts.sort(byNewest);
}

export async function getPage(id: string) {
  const { data } = await requireEntry("pages", id);
  return data;
}

// The interface text of each part of the site: one collection each, with a
// single entry.
export async function getHomeCopy() {
  const { data } = await requireEntry("home", "home");
  return data;
}

export async function getLayoutCopy() {
  const { data } = await requireEntry("layout", "layout");
  return data;
}

export async function getNotFoundPage() {
  const { data } = await requireEntry("notFound", "notFound");
  return data;
}

export async function getPostCopy() {
  const { data } = await requireEntry("post", "post");
  return data;
}

export async function getProjectCopy() {
  const { data } = await requireEntry("project", "project");
  return data;
}

export async function getSearchCopy() {
  const { data } = await requireEntry("search", "search");
  return data;
}

export async function getViewerCopy() {
  const { data } = await requireEntry("viewer", "viewer");
  return data;
}

export async function getWritingIndexCopy() {
  const { data } = await requireEntry("writingIndex", "writingIndex");
  return data;
}

export async function getCvFormatCopy(format: "pdf" | "markdown") {
  const { data } = await requireEntry("cvFormats", format);
  return data;
}

// The header's navigation: Home, then each listing page under its title.
export async function getSections(): Promise<readonly Section[]> {
  const [layout, projects, writing] = await Promise.all([
    getLayoutCopy(),
    getPage("projects"),
    getPage("writing"),
  ]);
  return [
    { label: layout.homeLabel, href: routes.home },
    { label: projects.title, href: routes.projects },
    { label: writing.title, href: routes.writing },
  ];
}

export async function getFeedTitle(): Promise<string> {
  const [profile, page] = await Promise.all([getProfile(), getPage("writing")]);
  return fill(profile.feedTitle, { name: profile.name, page: page.title });
}

const readingTime = z.object({ minutesRead: z.number() });

// "4 min read": a post's reading time, as its header, Writing and its share
// image show it.
export async function getReadingTime(
  post: CollectionEntry<"writing">,
): Promise<string> {
  const [{ remarkPluginFrontmatter }, copy] = await Promise.all([
    render(post),
    getPostCopy(),
  ]);
  const minutes = readingTime.parse(remarkPluginFrontmatter).minutesRead;
  return fill(copy.readingTime, { minutes: String(minutes) });
}

export type Topic = {
  readonly slug: string;
  readonly label: string;
  readonly count: number;
};

// Topics are not case sensitive; the label is the newest post's spelling.
// Keyed by slug, in label order.
export function getTopics(
  posts: readonly CollectionEntry<"writing">[],
): ReadonlyMap<string, Topic> {
  const topics = new Map<string, Topic>();
  for (const { data } of posts.toSorted(byNewest)) {
    const { slug, label } = data.topic;
    const existing = topics.get(slug);
    topics.set(slug, {
      slug,
      label: existing?.label ?? label,
      count: (existing?.count ?? 0) + 1,
    });
  }
  return new Map(
    [...topics].sort(([, a], [, b]) => compareText(a.label, b.label)),
  );
}

export function topicLabel(
  topics: ReadonlyMap<string, Topic>,
  topic: CollectionEntry<"writing">["data"]["topic"],
): string {
  return topics.get(topic.slug)?.label ?? topic.label;
}
