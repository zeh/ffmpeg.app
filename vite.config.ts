import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		preact(),
		// Fix cross-origin-isolation so we can use SharedArrayBuffers
		// See: https://github.com/ffmpegwasm/ffmpeg.wasm/issues/106
		// From: https://github.com/chaosprint/vite-plugin-cross-origin-isolation
		{
			name: "configure-response-headers",
			configureServer: (server) => {
				server.middlewares.use((_req, res, next) => {
					res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
					res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
					next();
				});
			},
		},
	],
	// Prevents issues with worker loading: https://github.com/ffmpegwasm/ffmpeg.wasm/issues/523
	optimizeDeps: {
		exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
	},
	css: {
		modules: {
			// https://github.com/webpack/loader-utils#interpolatename
			// Default seems to be "_[local]_[hash:base64:5]_[some number?"
			generateScopedName: "[contenthash:base64:8]",
		},
	}
});
