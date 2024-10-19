import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Language } from "@/options";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const parsers = {
  javascript: {
    import: () => import("prettier/parser-babel"),
    name: "babel",
  },
  typescript: {
    import: () => import("prettier/parser-typescript"),
    name: "typescript",
  },
  tsx: {
    import: () => import("prettier/parser-typescript"),
    name: "typescript",
  },
  markdown: {
    import: () => import("prettier/parser-markdown"),
    name: "markdown",
  },
  html: { import: () => import("prettier/parser-html"), name: "html" },
  css: { import: () => import("prettier/parser-postcss"), name: "css" },
  scss: { import: () => import("prettier/parser-postcss"), name: "css" },
  yaml: { import: () => import("prettier/parser-yaml"), name: "yaml" },
};

export const formatterSupportedLanguages: Language["name"][] = Object.keys(
  parsers
).map((key) => key.toLowerCase());

const prettierConfig = {
  singleQuote: false,
  printWidth: 80,
  semi: true,
};

export async function formatCode(code: string, language: Language["name"] | null) {
  if (!language || !formatterSupportedLanguages.includes(language)) {
    return code;
  }
  const prettier = await import("prettier/standalone");

  const parser = parsers[language as keyof typeof parsers];

  if (!parser) {
    throw new Error(`No parser found for language: ${language}`);
  }
  const parserModule = await parser.import();

  const formatted = await prettier.format(code, {
    parser: parser.name,
    plugins: [
      parserModule,
      ...(["TypeScript", "JavaScript", "TSX"].includes(language)
        ? [(await import("prettier/parser-espree")).default]
        : []),
    ],
    ...prettierConfig,
  });

  return formatted.replace(/\n$/, "");
}