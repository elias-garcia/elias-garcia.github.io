import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import {
  getFeedTitle,
  getPage,
  getPosts,
  getTopics,
  topicLabel,
} from "../lib/content.ts";

export const GET: APIRoute = async ({ site }) => {
  const [title, page, posts] = await Promise.all([
    getFeedTitle(),
    getPage("writing"),
    getPosts(),
  ]);
  if (site === undefined) {
    throw new Error("Set `site` in astro.config.ts for the RSS feed.");
  }
  const topics = getTopics(posts);
  return rss({
    title,
    description: page.intro,
    site,
    trailingSlash: false,
    items: posts.map(({ id, data }) => ({
      title: data.title,
      description: data.description,
      pubDate: data.date,
      categories: [topicLabel(topics, data.topic)],
      link: `/writing/${id}`,
    })),
  });
};
