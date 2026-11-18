import type { APIRoute } from "astro";
import { getProfile, getShareCopy } from "../../lib/content.ts";
import { requireSite } from "../../lib/navigation.ts";
import { renderSiteImage } from "../../lib/share-image.ts";

// The share image for every page but posts.
export const GET: APIRoute = async ({ site }) => {
  const [profile, { sections }] = await Promise.all([
    getProfile(),
    getShareCopy(),
  ]);
  const png = await renderSiteImage({
    name: profile.name,
    role: profile.role,
    sections,
    domain: requireSite(site, "the domain on share images").host,
  });
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
