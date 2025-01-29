import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	useRouteError,
} from "@remix-run/react";
import { metadata } from "~/data/meta";
import stylesheet from "~/styles/tailwind.css?url";

export function loader() {
	return json(metadata);
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
		{ rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
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
			min-h-screen font-mono overflow-hidden"
			>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}
