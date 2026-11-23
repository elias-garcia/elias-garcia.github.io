import { stat } from "node:fs/promises";
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
import { routes } from "./routes.ts";
import { hasProjects } from "./sections.ts";

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
      icon: "file-code",
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
