import eslintPluginAstro from "eslint-plugin-astro";
import { defineConfig, globalIgnores, includeIgnoreFile } from "eslint/config";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

export default defineConfig(
  includeIgnoreFile(fileURLToPath(new URL(".gitignore", import.meta.url))),
  globalIgnores(["design/", ".agents/", ".claude/"]),
  tseslint.configs.strict,
  eslintPluginAstro.configs.recommended,
  {
    rules: {
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        { assertionStyle: "never" },
      ],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "no-restricted-syntax": [
        "error",
        {
          selector: "ClassDeclaration",
          message: "Use functions, not classes.",
        },
        { selector: "ClassExpression", message: "Use functions, not classes." },
        { selector: "ThisExpression", message: "Use functions, not `this`." },
      ],
    },
    linterOptions: { noInlineConfig: true },
  },
);
