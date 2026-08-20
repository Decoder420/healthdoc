import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    rules: {
      // Next 16 enables the React Compiler lint preset. The existing app uses
      // effect-driven data loaders and draft synchronisation extensively; keep
      // those patterns buildable while they are migrated incrementally.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    ignores: [".next/**", "dist/**", "node_modules/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
