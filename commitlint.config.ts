import type { UserConfig as Config } from "@commitlint/types";
import { RuleConfigSeverity } from "@commitlint/types";

enum RuleConfigType {
	Always = "always",
	Never = "never",
}

const config: Config = {
	// Base conventional commits rules
	extends: ["@commitlint/config-conventional"],

	// Custom rules
	rules: {
		// Minimum type length
		"type-min-length": [RuleConfigSeverity.Error, RuleConfigType.Always, 2],
		// Minimum subject length
		"subject-min-length": [RuleConfigSeverity.Error, RuleConfigType.Always, 8],
	},
};

export default config;
