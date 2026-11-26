import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";
import { getPosts } from "../../lib/content.ts";
import { requireSite } from "../../lib/navigation.ts";
import { renderPostMarkdown } from "../../lib/post-markdown.ts";

export const getStaticPaths = (async () => {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = async ({ props, site }) => {
  const siteUrl = requireSite(site, "the Markdown versions");
  return new Response(await renderPostMarkdown(props.post, siteUrl), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
