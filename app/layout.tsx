import "./globals.css";
import { Metadata } from "next";
import React from "react";
import { Roboto_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
	title: "y0gu",
	applicationName: "dy0gu",
	description: "Just an individual, writing some code on the internet.",
	metadataBase: new URL("https://dy0gu.com"),
};

const font = Roboto_Mono({
	subsets: ["latin"],
	display: "block",
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={font.className}>
			<body className={"bg-black"}>
				<Analytics />
				{children}
			</body>
		</html>
	);
}
