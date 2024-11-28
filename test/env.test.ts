import { expect, test } from "@playwright/test";
import { env } from "../src/utils/env";

test("env", () => {
	expect(env).toBeDefined();
});
