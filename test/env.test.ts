import { expect, test } from "@playwright/test";
import { env } from "~/utils/env";

test("env", () => {
	expect(env).toBeDefined();
});
