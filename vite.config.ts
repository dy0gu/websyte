import { vitePlugin as remix } from "@remix-run/dev";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		remix({
			appDirectory: "src",
		}),
		tsconfigPaths(),
	],
	css: {
		postcss: {
			plugins: [tailwindcss, autoprefixer],
		},
	},
	define: {
		__REACT_DEVTOOLS_GLOBAL_HOOK__: JSON.stringify({ isDisabled: true }),
	},
});
