import { redirect } from "@tanstack/react-router";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

import {
	adminPasswordMatches,
	getAdminSession,
} from "#/server/admin-auth.server";

const loginInputSchema = z.object({
	password: z.string().min(1).max(200),
});

const attempts = new Map<string, number[]>();

function clientKey() {
	return (
		getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ??
		getRequestHeader("x-real-ip") ??
		"unknown"
	);
}

function checkLoginRateLimit() {
	const key = clientKey();
	const now = Date.now();
	const recent = (attempts.get(key) ?? []).filter(
		(time) => now - time < 15 * 60_000,
	);
	if (recent.length >= 5) {
		throw new Error("Too many login attempts. Try again later.");
	}
	attempts.set(key, [...recent, now]);
	return key;
}

export const adminAuthMiddleware = createMiddleware({
	type: "function",
}).server(async ({ next }) => {
	const session = await getAdminSession();
	if (session.data.authenticated !== true) throw new Error("Unauthorized");
	return next();
});

export const getAdminStatus = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await getAdminSession();
		return session.data.authenticated === true;
	},
);

export const requireAdminPage = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await getAdminSession();
		if (session.data.authenticated !== true) {
			throw redirect({ to: "/admin/login" });
		}
		return true;
	},
);

export const loginAdmin = createServerFn({ method: "POST" })
	.validator(loginInputSchema)
	.handler(async ({ data }) => {
		const key = checkLoginRateLimit();
		if (!adminPasswordMatches(data.password)) {
			throw new Error("Invalid password");
		}

		attempts.delete(key);
		const session = await getAdminSession();
		const clearedSession = await session.clear();
		await clearedSession.update({ authenticated: true });
		return { authenticated: true };
	});

export const logoutAdmin = createServerFn({ method: "POST" })
	.middleware([adminAuthMiddleware])
	.handler(async () => {
		const session = await getAdminSession();
		await session.clear();
		return { authenticated: false };
	});
