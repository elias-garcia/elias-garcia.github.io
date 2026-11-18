import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";
import {
  getPage,
  getPostCopy,
  getPosts,
  getProfile,
  getReadingMinutes,
  getTopics,
  topicLabel,
} from "../../../lib/content.ts";
import { formatLongDate } from "../../../lib/format.ts";
import { requireSite } from "../../../lib/navigation.ts";
import { renderPostImage } from "../../../lib/share-image.ts";
import { fill } from "../../../lib/template.ts";

// A post's share image, with the details its header shows.
export const getStaticPaths = (async () => {
  const posts = await getPosts();
  const topics = getTopics(posts);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post, topic: topicLabel(topics, post.data.topic) },
  }));
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = async ({ props, site }) => {
  const { post, topic } = props;
  const [profile, writing, { readingTime }, minutes] = await Promise.all([
    getProfile(),
    getPage("writing"),
    getPostCopy(),
    getReadingMinutes(post),
  ]);
  const png = await renderPostImage({
    name: profile.name,
    section: writing.title,
    title: post.data.title,
    details: [
      formatLongDate(post.data.date),
      topic,
      fill(readingTime, { minutes: String(minutes) }),
    ],
    domain: requireSite(site, "the domain on share images").host,
  });
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
