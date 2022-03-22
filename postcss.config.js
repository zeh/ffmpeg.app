module.exports = {
	plugins: [
		require("postcss-mixins"),
		require("autoprefixer"),
		require("cssnano")({ preset: ["default", { discardComments: { removeAll: true } }] }),
	],
};
