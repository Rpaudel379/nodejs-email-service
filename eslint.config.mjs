import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ["node_modules", "out", "public", "dist"] },
  { files: ["src/**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn"],
      "no-multi-spaces": ["warn"],
      "no-multiple-empty-lines": ["warn", { max: 1, maxEOF: 0, maxBOF: 0 }],
    },
  },
];
