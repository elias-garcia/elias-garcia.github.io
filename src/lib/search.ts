import { getPosts, getSearchCopy, getTopics } from "./content.ts";
import { formatCount, formatMonthYear } from "./format.ts";
import { routes } from "./routes.ts";

export type SearchEntry = {
  readonly title: string;
  readonly line: string;
  readonly meta: string;
  readonly href: string;
};
export type SearchTopic = {
  readonly label: string;
  readonly count: string;
  readonly href: string;
};
export type SearchIndex = {
  readonly posts: readonly SearchEntry[];
  readonly topics: readonly SearchTopic[];
};

// What the search dialog carries in its HTML. A query matches only what a
// row shows, its title and line, so every result shows why it matched.
export async function getSearchIndex(): Promise<SearchIndex> {
  const [posts, copy] = await Promise.all([getPosts(), getSearchCopy()]);
  const topics = getTopics(posts);

  return {
    posts: posts.map((post) => ({
      title: post.data.title,
      line: post.data.description,
      meta: formatMonthYear(post.data.date),
      href: routes.post(post.id),
    })),
    topics: [...topics.values()].map(({ slug, label, count }) => ({
      label,
      count: formatCount(count, copy.postCount),
      href: routes.topic(slug),
    })),
  };
}
