import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "build-output/**",
    "built/**",
    "deploy/**",
    "dist-build/**",
    "dist-site/**",
    "dist/**",
    "final-build/**",
    "final/**",
    "output/**",
    "prod/**",
    "public-site/**",
    "release-build/**",
    "release/**",
    "site-build/**",
    "site/**",
    "www/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
