import type { Config } from "@react-router/dev/config";
import ts from "./tsconfig.json";

export default {
	ssr: true,
	appDirectory: "src",
	buildDirectory: ts.compilerOptions.outDir,
} satisfies Config;
