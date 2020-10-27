module.exports = {
  globals: {
    __PATH_PREFIX__: true,
  },
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/react",
  ],
  rules: {
    "react/jsx-pascal-case": [2, { allowAllCaps: false }],
    "react/jsx-fragments": [2, "element"],
    "react/jsx-wrap-multilines": [2, { declaration: "parens" }],
  },
};
