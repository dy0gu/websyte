import type {
	LinksFunction,
	MetaFunction,
} from "@remix-run/node";
import { type LoaderFunctionArgs, json } from "@remix-run/node";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";

import { metadata } from "~/configs/metadata";

import { resources } from "~/configs/resources";

import "~/styles/globals.css";

export async function loader({ request }: LoaderFunctionArgs) {
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
	return resources;
};

export default function Layout() {
	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body className="bg-black">
				<Outlet />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}
