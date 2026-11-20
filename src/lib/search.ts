import {
  getPosts,
  getProjects,
  getSearchCopy,
  getTopics,
  hasCaseStudy,
} from "./content.ts";
import { formatCount, formatMonthYear } from "./format.ts";
import { routes } from "./routes.ts";

// What the search dialog carries in its HTML. A query matches only what a
// row shows, its title and line, so every result shows why it matched.
export async function getSearchIndex() {
  const [posts, projects, copy] = await Promise.all([
    getPosts(),
    getProjects(),
    getSearchCopy(),
  ]);
  const topics = getTopics(posts);

  return {
    posts: posts.map((post) => ({
      title: post.data.title,
      line: post.data.description,
      meta: formatMonthYear(post.data.date),
      href: routes.post(post.id),
    })),
    projects: projects.map((project) => ({
      title: project.data.title,
      line: project.data.summary,
      meta: project.data.status,
      href: hasCaseStudy(project)
        ? routes.project(project.id)
        : routes.projects,
    })),
    topics: [...topics.values()].map(({ slug, label, count }) => ({
      label,
      count: formatCount(count, copy.postCount),
      href: routes.topic(slug),
    })),
  };
}
