import type { LinksFunction, MetaFunction } from "react-router";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import favicon from "~/assets/icons/favicon.ico?url";
import preview from "~/assets/images/og-preview.png?url";
import { info } from "~/data/info";
import stylesheet from "~/styles/tailwind.css?url";
import { env } from "~/utils/env";

export function loader() {
	return [
		{ title: info.name },
		{ name: "description", content: info.description },
		{ name: "viewport", content: "width=device-width, initial-scale=1" },
		{ charSet: "utf-8" },
		{ property: "og:type", content: "website" },
		{ property: "og:title", content: info.name },
		{ property: "og:description", content: info.description },
		{ property: "og:url", content: env.DOMAIN },
		{
			property: "og:image",
			content: `${env.DOMAIN}${preview}`,
		},
	];
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	const meta = data;
	if (Array.isArray(meta)) {
		return meta;
	}
	throw new Error("Invalid root metadata!");
};

export const links: LinksFunction = () => {
	return [
		{ rel: "sitemap", href: "/sitemap.xml" },
		{ rel: "icon", href: favicon, type: "image/svg+xml" },
		{ rel: "stylesheet", href: stylesheet },
	];
};

export default function Layout() {
	return (
		<html lang="en" className="overscroll-y-none">
			<head>
				<Meta />
				<Links />
			</head>
			<body
				className="bg-black bg-gradient-to-tl from-black via-zinc-600/20 to-black
			min-h-screen font-mono"
			>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}
