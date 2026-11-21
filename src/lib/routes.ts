// The site's addresses, built in one place.
export const routes = {
  home: "/",
  projects: "/projects",
  writing: "/writing",
  feed: "/rss.xml",
  cvPdf: "/cv.pdf",
  cvMarkdown: "/cv.md",
  shareImage: "/share/site.png",
  sitemap: "/sitemap-index.xml",
  project: (id: string) => `/projects/${id}`,
  post: (id: string) => `/writing/${id}`,
  postMarkdown: (id: string) => `/writing/${id}.md`,
  postShareImage: (id: string) => `/share/writing/${id}.png`,
  topic: (slug: string) => `/writing/topics/${slug}`,
} as const;
