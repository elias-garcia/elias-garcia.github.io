import getReadingTime from "reading-time";
import { defineMdastPlugin } from "satteri";

export const mdastReadingTimePlugin = defineMdastPlugin({
  name: "mdast-reading-time",
  after(root, context) {
    const { astro } = context.data;
    if (astro === undefined) {
      return;
    }
    const { minutes } = getReadingTime(context.textContent(root));
    astro.frontmatter.minutesRead = Math.max(1, Math.ceil(minutes));
  },
});
