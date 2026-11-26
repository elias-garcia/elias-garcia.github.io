import type { APIRoute } from "astro";
import {
  getHomeCopy,
  getPage,
  getProfile,
  getProjects,
  getTalks,
} from "../../lib/content.ts";
import { requireSite } from "../../lib/navigation.ts";
import { hasWriting } from "../../lib/sections.ts";
import { renderSiteImage } from "../../lib/share-image.ts";

// The share image for every page but posts. Along its bottom: what the site
// holds, under the titles Home and Writing use.
export const GET: APIRoute = async ({ site }) => {
  const [profile, projects, talks, writing, home] = await Promise.all([
    getProfile(),
    getProjects(),
    getTalks(),
    getPage("writing"),
    getHomeCopy(),
  ]);
  const png = await renderSiteImage({
    name: profile.name,
    role: profile.role,
    sections: [
      ...(projects.length > 0 ? [home.projects] : []),
      ...(hasWriting ? [writing.title] : []),
      ...(talks.length > 0 ? [home.speaking] : []),
    ],
    domain: requireSite(site, "the domain on share images").host,
  });
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
