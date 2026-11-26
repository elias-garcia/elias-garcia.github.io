import type { CollectionEntry } from "astro:content";
import type { BlogPosting, Person, WebSite, WithContext } from "schema-dts";
import { isoDate } from "./format.ts";

type Profile = CollectionEntry<"site">["data"];

// Schema.org data for search engines and agents (DESIGN.md §7), typed with
// schema-dts so a misspelt property or a wrong value fails the build.

// The site itself, so search results can name it.
export function website(profile: Profile, site: URL): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: profile.name,
    url: site.href,
  };
}

export function person(
  profile: Profile,
  site: URL,
  image: URL,
): WithContext<Person> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    url: site.href,
    image: image.href,
    // Profiles elsewhere: every contact link but email.
    sameAs: profile.contact
      .map(({ href }) => href)
      .filter((href) => href.startsWith("https://")),
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.city,
      addressCountry: profile.country,
    },
  };
}

export function blogPosting(
  post: CollectionEntry<"writing">,
  topic: string,
  author: Profile,
  site: URL,
  url: URL,
  image: URL,
): WithContext<BlogPosting> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.data.title,
    description: post.data.description,
    datePublished: isoDate(post.data.date),
    url: url.href,
    mainEntityOfPage: url.href,
    image: image.href,
    about: { "@type": "Thing", name: topic },
    author: { "@type": "Person", name: author.name, url: site.href },
  };
}
