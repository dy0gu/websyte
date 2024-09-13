import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";

import { metadata } from "~/data/meta";

import { rels } from "~/data/attributes";

import "~/styles/globals.css";

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
	return rels;
};

export default function Layout() {
	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body className="bg-black bg-gradient-to-tl from-black via-zinc-600/20 to-black">
				<Outlet />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}
