/** @type {import("prettier").Config} */
module.exports = {
  arrowParens: "always",
  printWidth: 80,
  singleQuote: false,
  jsxSingleQuote: false,
  semi: true,
  trailingComma: "all",
  importOrder: [
    "<THIRD_PARTY_MODULES>",
    "^@/pages(.*)$",
    "^@/components(.*)$",
    "^@/store(.*)$",
    "^@/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  tabWidth: 2,
  plugins: [
    require.resolve("prettier-plugin-tailwindcss"),
    "@trivago/prettier-plugin-sort-imports",
  ],
  tailwindConfig: "./tailwind.config.js",
  tailwindFunctions: ["cn"],
};
