import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        files: ["*.ts", "*.tsx"], // Apply TS/TSX rules
        languageOptions: {
            parser: "@typescript-eslint/parser", // <-- TypeScript parser
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true, // <-- Enable JSX parsing
                },
            },
        },
        rules: {
            "react/react-in-jsx-scope": "off", // Next.js auto-imports React
        },
    },
  {

    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },

];

export default eslintConfig;
