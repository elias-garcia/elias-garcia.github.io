import {
  getCollection,
  getEntry,
  render,
  type CollectionEntry,
  type CollectionKey,
} from "astro:content";
import { z } from "astro/zod";
import { compareText } from "./format.ts";

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

export async function getTalks() {
  const talks = await getCollection("talks");
  return talks.sort((a, b) => byYearThenTitle(a.data, b.data));
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
  return (project.body ?? "").trim() !== "";
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

export async function getFeedTitle(): Promise<string> {
  const [profile, page] = await Promise.all([getProfile(), getPage("writing")]);
  return `${profile.name}: ${page.title}`;
}

const readingTime = z.object({ minutesRead: z.number() });

export async function getReadingMinutes(
  post: CollectionEntry<"writing">,
): Promise<number> {
  const { remarkPluginFrontmatter } = await render(post);
  return readingTime.parse(remarkPluginFrontmatter).minutesRead;
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
