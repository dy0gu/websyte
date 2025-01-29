import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { z } from "zod";

dotenvExpand.expand(dotenv.config());

const SCHEMA = z.object({
	// Port the server will listen on
	PORT: z.coerce.number().int().min(1000).max(65535),
	// URL where the web app is served, used for metadata
	DOMAIN: z.string(),
	// Optional variable that is set by some CI services
	CI: z.string().optional(),
});

// Convert all environment variables to uppercase and remove any that are empty
const normalized: { [key: string]: string } = {};
for (const key in process.env) {
	if (process.env[key]) {
		normalized[key.toUpperCase()] = process.env[key] as string;
	}
}

// Pretty print errors during validation
function parse(input: { [key: string]: string }) {
	try {
		return SCHEMA.parse(input);
	} catch (err) {
		if (err instanceof z.ZodError) {
			for (const issue of err.issues) {
				// biome-ignore lint/suspicious/noConsole: will only be sent to the server
				console.error(
					`  ❌ Error on ${issue.path} environment variable - ${issue.message}`,
				);
			}
		}
		process.exit(1);
	}
}

const env = parse(normalized);

// Always read environment variables through this object instead of
// directly accessing process.env in order to ensure type safety
// Calls to this object will only work on the server side, meaning loader and action functions
export { env };
