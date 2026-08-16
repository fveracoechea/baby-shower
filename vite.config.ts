import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	build: { assetsDir: "_build" },
	plugins: [
		paraglideVitePlugin({
			project: "./project.inlang",
			outdir: "./src/paraglide",
			strategy: ["url", "baseLocale"],
		}),
		nitro({
			preset: "node-server",
			rollupConfig: { external: [/^@sentry\//] },
			routeRules: {
				"/assets/**": {
					headers: {
						"cache-control":
							"public, max-age=86400, stale-while-revalidate=604800",
					},
				},
				"/opengraph-image.png": {
					headers: {
						"cache-control":
							"public, max-age=86400, stale-while-revalidate=604800",
					},
				},
				"/drizzle.svg": {
					headers: {
						"cache-control":
							"public, max-age=86400, stale-while-revalidate=604800",
					},
				},
			},
		}),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],
});

export default config;
