import type {
	ActionFunctionArgs,
	LinksFunction,
	MetaFunction,
} from "@remix-run/node";
import { type LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from "@remix-run/react";

import { hyperlinks } from "~/configs/hyperlinks";

import "~/styles/globals.css";

// export async function loader({ request }: LoaderFunctionArgs) {
// 	const locale = await i18nServer.getLocale(request);
// 	return json(
// 		{ locale: locale, metadata: metadata },
// 		{ headers: { "Set-Cookie": await localeCookie.serialize(locale) } },
// 	);
// }

// export async function action({ request }: ActionFunctionArgs) {
// 	const body = await request.formData();

// 	if (body.get("action") === CHANGE_LANGUAGE_ACTION) {
// 		const locale = body.get(LOCALE_COOKIE_ID);
// 		return redirect(body.get("path") as string, {
// 			headers: {
// 				"Set-Cookie": await localeCookie.serialize(locale),
// 			},
// 		});
// 	}
// }

// export const meta: MetaFunction<typeof loader> = ({ data }) => {
// 	// Maybe use the locale to send metadata in different languages here?
// 	// Doing so would mean changing the metadata object implementation.
// 	const meta = data?.metadata;
// 	if (Array.isArray(meta)) {
// 		return meta;
// 	}
// 	throw new Error("Invalid root metadata!");
// };

export const links: LinksFunction = () => {
	return hyperlinks;
};

export default function Layout() {
	return (
		<html lang="en">
			<head>
				{/* <Meta /> */}
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
