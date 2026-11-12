import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";
import { getPosts } from "../../lib/content.ts";
import { renderPostMarkdown } from "../../lib/post-markdown.ts";

export const getStaticPaths = (async () => {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = async ({ props, site }) => {
  if (site === undefined) {
    throw new Error("Set `site` in astro.config.ts for the Markdown versions.");
  }
  return new Response(await renderPostMarkdown(props.post, site), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
