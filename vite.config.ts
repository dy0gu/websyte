import { vitePlugin as remix } from "@remix-run/dev";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { env } from "./src/utils/env";

export default defineConfig({
	server: {
		port: env.PORT,
	},
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
});
