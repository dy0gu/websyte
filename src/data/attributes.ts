import stylesheet from "~/styles/tailwind.css?url";

// Reusable values throughout the app
const info = {
	name: "Dy0gu",
	description: "Just an individual, writing some code on the internet.",
	links: [
		{ name: "GitHub", href: "https://www.github.com/dy0gu" },
		{
			name: "Stack Overflow",
			href: "https://stackoverflow.com/users/22441488",
		},
	],
};

// Link tags for the <head> of the root html document
const rels = [
	{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
	{ rel: "sitemap", href: "/sitemap.xml" },
	{ rel: "manifest", href: "/manifest.webmanifest" },
	{ rel: "stylesheet", href: stylesheet },
];

export { info, rels };
