import { relative } from "node:path";
import { fileURLToPath } from "node:url";
import { defineMdastPlugin, type PluginFactoryContext } from "satteri";
import { entryFolders } from "./entries.ts";
import { describeDisallowed, disallowedNodes } from "./entry-description.ts";

const entryFile = new RegExp(
  `/src/content/(${entryFolders.join("|")})/[^/]+\\.mdx$`,
);

// Fails the build when an entry's description holds more than it may
// (src/lib/entry-description.ts). Posts aren't checked.
export function mdastEntryDescriptionPlugin({ fileURL }: PluginFactoryContext) {
  if (fileURL === undefined || !entryFile.test(fileURL.pathname)) {
    return null;
  }
  const file = relative(process.cwd(), fileURLToPath(fileURL));
  return defineMdastPlugin({
    name: "entry-description",
    before(root) {
      const found = disallowedNodes(root);
      if (found.length > 0) {
        throw new Error(describeDisallowed(found, file));
      }
    },
  });
}
