import type { ComponentProps } from "astro/types";
import { stat } from "node:fs/promises";
import type Icon from "../components/Icon.astro";
import {
  getCourses,
  getCvFormatCopy,
  getEducation,
  getHomeCopy,
  getProfile,
  getProjects,
  getTalks,
  getWork,
  withDescriptions,
} from "./content.ts";
import {
  formatCountry,
  formatEntryDate,
  formatEntryRange,
  formatFileSize,
} from "./format.ts";
import { leavesSite, writtenAddress } from "./links.ts";
import { routes } from "./routes.ts";
import { fill } from "./template.ts";

type IconName = ComponentProps<typeof Icon>["name"];

// The icon in front of each profile in the CV's contact band, by its domain.
const profileIcons: Record<string, IconName> = {
  "github.com": "brand-github",
  "linkedin.com": "brand-linkedin",
  "x.com": "brand-x",
};

function profileIcon(href: string): IconName {
  const icon = profileIcons[new URL(href).hostname.replace(/^www\./, "")];
  if (icon === undefined) {
    throw new Error(`The CV has no icon for ${href}: add one to profileIcons.`);
  }
  return icon;
}

// An address written out on the CV, as a link. One on this site is
// written in full.
function address(href: string) {
  const url = leavesSite(href)
    ? href
    : new URL(href, import.meta.env.SITE).href;
  return { href: url, text: writtenAddress(url) };
}

// An entry's description: its Markdown, for the Markdown CV, and its body
// rendered, for the PDF.
function description<Content>(entry: {
  body?: string | undefined;
  Content: Content;
}) {
  return { markdown: (entry.body ?? "").trim(), Content: entry.Content };
}

// What the CV PDF shows, from the collections (DESIGN.md, CV PDF): nothing is
// written for it. Sections without entries are left out.
export async function getCv() {
  const [copy, profile, work, talks, courses, education, projects] =
    await Promise.all([
      getHomeCopy(),
      getProfile(),
      getWork().then(withDescriptions),
      getTalks().then(withDescriptions),
      getCourses().then(withDescriptions),
      getEducation().then(withDescriptions),
      getProjects().then(withDescriptions),
    ]);
  const site = import.meta.env.SITE;
  const isEmail = (href: string) => href.startsWith("mailto:");

  return {
    title: fill(profile.cvTitle, { name: profile.name }),
    name: profile.name,
    role: fill(copy.role, {
      role: profile.role,
      city: profile.city,
      country: formatCountry(profile.country),
    }),
    // The email, the site, then the profiles.
    contact: [
      ...profile.contact
        .filter(({ href }) => isEmail(href))
        .map(({ href }) => ({ ...address(href), icon: "mail" as const })),
      { ...address(site), icon: "world" as const },
      ...profile.contact
        .filter(({ href }) => !isEmail(href))
        .map(({ href }) => ({ ...address(href), icon: profileIcon(href) })),
    ],
    about: { title: copy.about, paragraphs: profile.about },
    experience: {
      title: copy.experience,
      jobs: work.map((job) => ({
        dates: formatEntryRange(job.data, copy.present),
        company: job.data.title,
        place: job.data.place,
        role: job.data.subtitle,
        description: description(job),
      })),
    },
    projects: {
      title: copy.projects,
      entries: projects.map((project) => ({
        date: formatEntryDate(project.data.date),
        title: project.data.title,
        address:
          project.data.link === undefined
            ? undefined
            : address(project.data.link),
        description: description(project),
      })),
    },
    speaking: {
      title: copy.speaking,
      entries: talks.map((talk) => ({
        date: formatEntryDate(talk.data.date),
        title: talk.data.title,
        address:
          talk.data.link === undefined ? undefined : address(talk.data.link),
        subtitle: talk.data.subtitle,
      })),
    },
    teaching: {
      title: copy.teaching,
      entries: courses.map((course) => ({
        date: formatEntryDate(course.data.date),
        title: course.data.title,
        address:
          course.data.link === undefined
            ? undefined
            : address(course.data.link),
        subtitle: course.data.subtitle,
      })),
    },
    education: {
      title: copy.education,
      degrees: education.map((degree) => ({
        dates: formatEntryRange(degree.data, copy.present),
        title:
          degree.data.subtitle === undefined
            ? degree.data.title
            : fill(copy.degree, {
                title: degree.data.title,
                school: degree.data.subtitle,
              }),
        description: description(degree),
      })),
    },
  };
}

// The CV as Markdown, for AI tools and agents: the PDF's sections, in the
// same order, so the two downloads never disagree.
export async function renderCvMarkdown(): Promise<string> {
  const cv = await getCv();
  // A section without entries is left out, as on the PDF.
  const section = (
    title: string,
    entries: readonly string[],
    separator = "\n",
  ) =>
    entries.length > 0 ? [`## ${title}\n\n${entries.join(separator)}`] : [];
  // A title followed by its address, as on the PDF.
  const titled = (title: string, link: { text: string } | undefined) =>
    link === undefined ? title : `${title} · ${link.text}`;
  // One list item: its date, its title, then a line of text, if any. A
  // description of several paragraphs is joined into that line.
  const item = (date: string, title: string, text: string | undefined) =>
    [`- ${date}: ${title}.`, text?.replace(/\s+/g, " ")]
      .filter((part) => part !== undefined && part !== "")
      .join(" ");

  return [
    `# ${cv.name}`,
    cv.role,
    cv.contact.map(({ text }) => text).join(" · "),
    ...section(cv.about.title, cv.about.paragraphs, "\n\n"),
    ...section(
      cv.experience.title,
      cv.experience.jobs.map((job) =>
        [
          `### ${job.company} · ${job.place}`,
          [job.role, job.dates]
            .filter((part) => part !== undefined)
            .join(" · "),
          ...(job.description.markdown === ""
            ? []
            : ["", job.description.markdown]),
        ].join("\n"),
      ),
      "\n\n",
    ),
    ...section(
      cv.projects.title,
      cv.projects.entries.map((project) =>
        item(
          project.date,
          titled(project.title, project.address),
          project.description.markdown,
        ),
      ),
    ),
    ...section(
      cv.speaking.title,
      cv.speaking.entries.map((talk) =>
        item(talk.date, titled(talk.title, talk.address), talk.subtitle),
      ),
    ),
    ...section(
      cv.teaching.title,
      cv.teaching.entries.map((course) =>
        item(
          course.date,
          titled(course.title, course.address),
          course.subtitle,
        ),
      ),
    ),
    ...section(
      cv.education.title,
      cv.education.degrees.map((degree) =>
        item(degree.dates, degree.title, degree.description.markdown),
      ),
    ),
  ]
    .join("\n\n")
    .concat("\n");
}

export async function getCvFormats() {
  const [sizes, pdf, markdown] = await Promise.all([
    getCvSizes(),
    getCvFormatCopy("pdf"),
    getCvFormatCopy("markdown"),
  ]);
  return [
    {
      ...pdf,
      href: routes.cvPdf,
      size: formatFileSize(sizes.pdf),
      icon: "file-text",
    },
    {
      ...markdown,
      href: routes.cvMarkdown,
      size: formatFileSize(sizes.markdown),
      icon: "markdown",
    },
  ] as const;
}

// The size of the printed PDF. While it's being printed (the `cv` mode) it
// doesn't exist yet, and the pages of that build aren't kept.
async function getPdfSize(): Promise<number> {
  if (import.meta.env.MODE === "cv") {
    return 0;
  }
  try {
    // Relative to the project root, where Astro runs; bundling moves this module.
    return (await stat("public/cv.pdf")).size;
  } catch (error) {
    throw new Error(
      "public/cv.pdf is missing: print it with `npm run cv` (`npm run build` does too).",
      { cause: error },
    );
  }
}

async function getCvSizes() {
  const [pdf, markdown] = await Promise.all([getPdfSize(), renderCvMarkdown()]);
  return {
    pdf,
    markdown: Buffer.byteLength(markdown, "utf8"),
  };
}
