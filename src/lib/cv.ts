import type { ComponentProps } from "astro/types";
import { stat } from "node:fs/promises";
import type Icon from "../components/Icon.astro";
import {
  getCourses,
  getCvFormatCopy,
  getEducation,
  getHomeCopy,
  getPage,
  getProfile,
  getProjects,
  getTalks,
  getWork,
  hasCaseStudy,
  workMode,
} from "./content.ts";
import {
  formatCount,
  formatCountry,
  formatFileSize,
  formatMinutes,
  formatMonthYear,
  formatYearRange,
} from "./format.ts";
import { writtenAddress } from "./links.ts";
import { routes } from "./routes.ts";
import { hasProjects } from "./sections.ts";
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

// An address written out on the CV, as a link.
function address(href: string) {
  return { href, text: writtenAddress(href) };
}

// What the CV PDF shows, from the collections (DESIGN.md, CV PDF): nothing is
// written for it. Sections without entries are left out.
export async function getCv() {
  const [
    copy,
    projectsPage,
    profile,
    work,
    talks,
    courses,
    education,
    projects,
  ] = await Promise.all([
    getHomeCopy(),
    getPage("projects"),
    getProfile(),
    getWork(),
    getTalks(),
    getCourses(),
    getEducation(),
    getProjects(),
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
      jobs: work.map(({ data }) => ({
        dates: formatYearRange(data, copy.present),
        company: data.company,
        mode: workMode(data),
        role: data.role,
        points: data.points,
      })),
    },
    projects: {
      title: projectsPage.title,
      entries: hasProjects
        ? projects.map((project) => ({
            year: String(project.data.year),
            title: project.data.title,
            // The case study first, then the project's own links.
            addresses: [
              ...(hasCaseStudy(project)
                ? [new URL(routes.project(project.id), site).href]
                : []),
              ...project.data.links.map(({ href }) => href),
            ].map(address),
            summary: project.data.summary,
          }))
        : [],
    },
    speaking: {
      title: copy.speaking,
      talks: talks.map(({ data }) => ({
        date: formatMonthYear(data.date),
        title: data.title,
        where: data.where,
      })),
    },
    teaching: {
      title: copy.teaching,
      courses: courses.map(({ data }) => ({
        date: formatMonthYear(data.date),
        title: data.title,
        address: address(data.href),
        where: data.where,
      })),
    },
    education: {
      title: copy.education,
      degrees: education.map(({ data }) => ({
        dates: formatYearRange(data, copy.present),
        title: fill(copy.degree, { title: data.title, school: data.school }),
        detail: data.detail,
      })),
    },
  };
}

export async function renderCvMarkdown(): Promise<string> {
  const [
    copy,
    projectsPage,
    profile,
    work,
    talks,
    courses,
    education,
    projects,
  ] = await Promise.all([
    getHomeCopy(),
    getPage("projects"),
    getProfile(),
    getWork(),
    getTalks(),
    getCourses(),
    getEducation(),
    getProjects(),
  ]);

  const contact = profile.contact
    .map(({ label, text }) => `${label}: ${text}`)
    .join(" · ");

  const jobs = work.map(({ data }) =>
    [
      `### ${data.company}: ${data.role}`,
      `${formatYearRange(data, copy.present)} · ${workMode(data)} · ${data.about}`,
      "",
      ...data.points.map((point) => `- ${point}`),
    ].join("\n"),
  );

  const talkLines = talks.map(
    ({ data }) =>
      `- ${formatMonthYear(data.date)}: ${data.title}, ${data.where}`,
  );

  const courseLines = courses.map(({ data }) => {
    const title =
      data.originalTitle === undefined
        ? data.title
        : `${data.title} (${data.originalTitle})`;
    return `- ${formatMonthYear(data.date)}: ${title}, ${data.where} · ${formatCount(data.lessons, copy.lessonCount)} · ${formatMinutes(data.minutes)}`;
  });

  const degrees = education.map(
    ({ data }) =>
      `- ${formatYearRange(data, copy.present)}: ${data.title}, ${data.school}. ${data.detail}`,
  );

  const projectLines = projects.map(
    ({ data }) =>
      `- ${data.title} (${data.status}, ${String(data.year)}): ${data.summary}`,
  );

  return [
    `# ${profile.name}`,
    `${profile.role} · ${profile.city}, ${formatCountry(profile.country)} · ${profile.availability}`,
    contact,
    `## ${copy.about}`,
    profile.about.join("\n\n"),
    `## ${copy.experience}`,
    jobs.join("\n\n"),
    `## ${copy.speaking}`,
    talkLines.join("\n"),
    `## ${copy.teaching}`,
    courseLines.join("\n"),
    `## ${copy.education}`,
    degrees.join("\n"),
    ...(hasProjects
      ? [`## ${projectsPage.title}`, projectLines.join("\n")]
      : []),
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

async function getCvSizes() {
  const [pdf, markdown] = await Promise.all([
    // Relative to the project root, where Astro runs; bundling moves this module.
    stat("public/cv.pdf"),
    renderCvMarkdown(),
  ]);
  return {
    pdf: pdf.size,
    markdown: Buffer.byteLength(markdown, "utf8"),
  };
}
