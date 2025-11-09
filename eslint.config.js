import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
	js.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	prettier,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			"no-console": ["error", { allow: ["error", "info", "warn", "assert"] }],
			"no-dupe-class-members": "off",
			indent: "off",
			"sort-imports": ["error", { ignoreDeclarationSort: true }],
			"sort-keys": ["error", "asc", { caseSensitive: true, natural: false, minKeys: 20 }],
			"@typescript-eslint/explicit-function-return-type": ["error", { allowExpressions: true }],
			"@typescript-eslint/naming-convention": [
				"error",
				{
					selector: "parameter",
					format: ["camelCase"],
				},
				{
					selector: "memberLike",
					modifiers: ["private"],
					format: ["camelCase", "UPPER_CASE"],
					leadingUnderscore: "allow",
				},
				{
					selector: "typeLike",
					format: ["PascalCase"],
				},
				{
					selector: "interface",
					format: ["PascalCase"],
					custom: {
						regex: "^I[A-Z]",
						match: true,
					},
				},
				{
					selector: "enumMember",
					format: ["camelCase", "PascalCase"],
				},
			],
			"@typescript-eslint/array-type": ["error", { default: "array-simple" }],
		},
	},
	{
		ignores: ["dist/**", "node_modules/**", "*.config.js", "*.config.ts"],
	},
);
