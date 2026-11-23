import type { APIRoute } from "astro";
import { getHomeCopy, getPage, getProfile } from "../../lib/content.ts";
import { requireSite } from "../../lib/navigation.ts";
import { hasProjects, hasWriting } from "../../lib/sections.ts";
import { renderSiteImage } from "../../lib/share-image.ts";

// The share image for every page but posts. Along its bottom: what the site
// holds, under the titles the pages use.
export const GET: APIRoute = async ({ site }) => {
  const [profile, projects, writing, home] = await Promise.all([
    getProfile(),
    getPage("projects"),
    getPage("writing"),
    getHomeCopy(),
  ]);
  const png = await renderSiteImage({
    name: profile.name,
    role: profile.role,
    sections: [
      ...(hasProjects ? [projects.title] : []),
      ...(hasWriting ? [writing.title] : []),
      home.speaking,
    ],
    domain: requireSite(site, "the domain on share images").host,
  });
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
