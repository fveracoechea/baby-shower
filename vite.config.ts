import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		paraglideVitePlugin({
			project: "./project.inlang",
			outdir: "./src/paraglide",
			strategy: ["url", "baseLocale"],
		}),
		nitro({
			preset: "node-server",
			rollupConfig: { external: [/^@sentry\//] },
		}),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],
});

export default config;
