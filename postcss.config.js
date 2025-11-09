import postcssMixins from "postcss-mixins";
import autoprefixer from "autoprefixer";
import postcssNesting from "postcss-nesting";
import cssnano from "cssnano";
import postcssSimpleVars from "postcss-simple-vars";

export default {
	plugins: [
		postcssMixins,
		autoprefixer,
		postcssNesting,
		cssnano({ preset: ["default", { discardComments: { removeAll: true } }] }),
		postcssSimpleVars,
	],
};
