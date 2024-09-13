import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { z } from "zod";

dotenvExpand.expand(dotenv.config());

// Convert all environment variables to uppercase and remove any that are empty
const normalized: { [key: string]: string } = {};
for (const key in process.env) {
	if (process.env[key]) {
		normalized[key.toUpperCase()] = process.env[key] as string;
	}
}

// Schema that should contain all variables meant to be validated
const expected = z.object({
	PORT: z.coerce.number().int().min(1000).max(65535),
	DOMAIN: z.string(),
	CI: z.string().optional(),
});

// Pretty print errors during validation
function parse(input: { [key: string]: string }) {
	try {
		return expected.parse(input);
	} catch (err) {
		if (err instanceof z.ZodError) {
			for (const issue of err.issues) {
				// biome-ignore lint/suspicious/noConsole: will only be sent to the server
				console.error(
					`❌ ${issue.message} for ${issue.path} environment variable!`,
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
