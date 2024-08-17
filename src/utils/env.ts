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

// Validate all environment variables
const Environment = z.object({
	PORT: z.coerce
		.number({
			invalid_type_error:
				"PORT not correctly defined in environment variables!",
		})
		.int({ message: "PORT must be an integer!" })
		.min(1000, { message: "PORT must be greater than 1000!" })
		.max(65535, { message: "PORT must be less than 65535!" }),
	DOMAIN: z.string({
		required_error: "DOMAIN not correctly defined in environment variables!",
	}),
	CI: z.string().optional(),
});

const env = Environment.parse(normalized);

// Always read environment variables through this object instead of
// directly accessing process.env in order to ensure type safety
// Calls to this object will only work on the server side, meaning loader and action functions
export { env };
