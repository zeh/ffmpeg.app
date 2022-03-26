module.exports = {
	plugins: [
		require("postcss-mixins"),
		require("autoprefixer"),
		require("postcss-nesting"),
		require("cssnano")({ preset: ["default", { discardComments: { removeAll: true } }] }),
	],
};
