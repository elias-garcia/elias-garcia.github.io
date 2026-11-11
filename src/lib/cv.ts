import { stat } from "node:fs/promises";
import {
  getEducation,
  getProfile,
  getProjects,
  getTalks,
  getWork,
} from "./content.ts";
import { formatYearRange } from "./format.ts";

export async function renderCvMarkdown(): Promise<string> {
  const [profile, work, talks, education, projects] = await Promise.all([
    getProfile(),
    getWork(),
    getTalks(),
    getEducation(),
    getProjects(),
  ]);

  const contact = profile.contact
    .map(({ label, text }) => `${label}: ${text}`)
    .join(" · ");

  const jobs = work.map(({ data }) =>
    [
      `### ${data.company}: ${data.role}`,
      `${formatYearRange(data)} · ${data.about}`,
      "",
      ...data.points.map((point) => `- ${point}`),
    ].join("\n"),
  );

  const talkLines = talks.map(({ data }) => {
    const title =
      data.originalTitle === undefined
        ? data.title
        : `${data.title} (${data.originalTitle})`;
    const detail = data.detail === undefined ? "" : ` · ${data.detail}`;
    return `- ${String(data.year)}: ${title}, ${data.where}${detail}`;
  });

  const degrees = education.map(
    ({ data }) =>
      `- ${formatYearRange(data)}: ${data.title}, ${data.school}. ${data.detail}`,
  );

  const projectLines = projects.map(
    ({ data }) =>
      `- ${data.title} (${data.status}, ${String(data.year)}): ${data.summary}`,
  );

  return [
    `# ${profile.name}`,
    `${profile.role} · ${profile.location} · ${profile.availability}`,
    contact,
    "## About",
    profile.about.join("\n\n"),
    "## Experience",
    jobs.join("\n\n"),
    "## Speaking and teaching",
    talkLines.join("\n"),
    "## Education",
    degrees.join("\n"),
    "## Projects",
    projectLines.join("\n"),
  ]
    .join("\n\n")
    .concat("\n");
}

export async function getCvSizes() {
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
