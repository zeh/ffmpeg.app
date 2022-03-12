module.exports = {
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	settings: {
	},
	env: {
		browser: true,
		es6: true,
	},
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		useJSXTextNode: true,
		project: "./tsconfig.json",
		tsconfigRootDir: "./",
		extraFileExtensions: [],
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:prettier/recommended",
	],
	rules: {
		"no-console": ["error", { allow: ["error", "info", "warn"] }],
		"no-dupe-class-members": ["off"],
		"indent": ["off"],
		"sort-imports": ["error", { ignoreDeclarationSort: true }],
		"sort-keys": ["error", "asc", { caseSensitive: true, natural: false, minKeys: 20 }],
		"prettier/prettier": "error",
		"@typescript-eslint/explicit-function-return-type": ["error", { allowExpressions: true }],
		"@typescript-eslint/naming-convention": ["error",
			{
				"selector": "parameter",
				"format": ["camelCase"],
			},
			{
				"selector": "memberLike",
				"modifiers": ["private"],
				"format": ["camelCase", "UPPER_CASE"],
				"leadingUnderscore": "allow"
			},
			{
				"selector": "typeLike",
				"format": ["PascalCase"]
			},
			{
				"selector": "interface",
				"format": ["PascalCase"],
				"custom": {
					"regex": "^I[A-Z]",
					"match": true
				}
			},
			{
				"selector": "enumMember",
				"format": ["camelCase", "PascalCase"],
			}
		],
		"@typescript-eslint/array-type": ["error", { default: "array-simple" }],
	},
};
