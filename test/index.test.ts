import { expect, test } from "@playwright/test";

test("page has no errors or warnings outputed to browser console on entry", async ({
	page,
}) => {
	const messages: string[] = [];
	page.on("console", (message) => messages.push(message.text().toLowerCase()));

	await page.goto("/");

	expect(messages).toEqual([]);
});
