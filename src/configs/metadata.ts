import { env } from "~/utils/env";

// Reusable values throughout the app
const info = {
	name: "Dy0gu",
	description: "Just an individual, writing some code on the internet.",
};

// Meta tags for the <head> of the root html document
// This object uses server environment variables, meaning it can only be called in Remix loader functions
const metadata = [
	{ title: info.name },
	{ name: "description", content: info.description },
	{ name: "viewport", content: "width=device-width, initial-scale=1" },
	{ charSet: "utf-8" },
	{ property: "og:title", content: info.name },
	{ property: "og:description", content: info.description },
	{ property: "og:type", content: "website" },
	{ property: "og:url", content: env.DOMAIN },
	{
		property: "og:image",
		content: `${env.DOMAIN}/preview.png`,
	},
];

export { info, metadata };
