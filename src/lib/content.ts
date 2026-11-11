import { getCollection, getEntry, type CollectionEntry } from "astro:content";

export async function getProfile() {
  const entry = await getEntry("site", "profile");
  if (entry === undefined) {
    throw new Error("src/content/site.yaml must define a `profile` entry.");
  }
  return entry.data;
}

function byYearThenTitle(
  a: { readonly year: number; readonly title: string },
  b: { readonly year: number; readonly title: string },
): number {
  return b.year - a.year || a.title.localeCompare(b.title);
}

export async function getWork() {
  const jobs = await getCollection("work");
  return jobs.sort(
    (a, b) =>
      b.data.start - a.data.start ||
      a.data.company.localeCompare(b.data.company),
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
      b.data.start - a.data.start || a.data.title.localeCompare(b.data.title),
  );
}

export async function getProjects() {
  const projects = await getCollection("projects");
  return projects.sort((a, b) => byYearThenTitle(a.data, b.data));
}

export function hasCaseStudy(project: CollectionEntry<"projects">): boolean {
  return (project.body ?? "").trim() !== "";
}

export async function getPosts() {
  const posts = await getCollection(
    "writing",
    ({ data }) => import.meta.env.DEV || !data.draft,
  );
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
