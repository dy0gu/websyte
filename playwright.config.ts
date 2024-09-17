import { defineConfig, devices } from "@playwright/test";
import { env } from "~/utils/env";

export default defineConfig({
	testDir: "./test",
	testMatch: "**/*.test.ts",
	fullyParallel: true,
	forbidOnly: !!env.CI,
	reporter: [
		["html", { open: "never", outputFolder: "coverage/html-report" }],
		["list"],
	],
	outputDir: "coverage/meta",
	retries: env.CI ? 2 : 0,
	workers: env.CI ? 1 : undefined,
	use: {
		baseURL: `${env.DOMAIN}`,
		trace: "on-first-retry",
	},
	// List of browsers to test against
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},

		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},

		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},
	],
	webServer: {
		command: "remix-serve ./build/server/index.js",
		port: env.PORT,
		reuseExistingServer: !env.CI,
	},
});
