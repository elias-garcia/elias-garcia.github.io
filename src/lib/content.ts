import { getEntry } from "astro:content";

export async function getProfile() {
  const entry = await getEntry("site", "profile");
  if (entry === undefined) {
    throw new Error("src/content/site.yaml must define a `profile` entry.");
  }
  return entry.data;
}
