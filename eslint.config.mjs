import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    // Turbopack dev artifacts (can be huge, slows lint and triggers Babel deopt logs):
    ".next-dev/**",
    ".next-dev-*/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated files:
    "public/sw.js",
  ]),
])

export default eslintConfig
