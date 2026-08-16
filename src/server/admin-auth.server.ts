import { createHash, timingSafeEqual } from "node:crypto";

import { useSession as getRequestSession } from "@tanstack/react-start/server";
import { config } from "dotenv";

config({ path: [".env.local", ".env"] });

export interface AdminSessionData {
	authenticated: boolean;
}

const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function requiredEnvironmentVariable(name: string) {
	const value = process.env[name];
	if (!value) throw new Error(`${name} is required`);
	return value;
}

export function getAdminSession() {
	const password = requiredEnvironmentVariable("ADMIN_SESSION_SECRET");
	if (password.length < 32) {
		throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters");
	}

	const production = process.env.NODE_ENV === "production";
	return getRequestSession<AdminSessionData>({
		password,
		maxAge: ADMIN_SESSION_MAX_AGE,
		name: production ? "__Host-admin-session" : "admin-session",
		sessionHeader: false,
		cookie: {
			httpOnly: true,
			maxAge: ADMIN_SESSION_MAX_AGE,
			path: "/",
			sameSite: "strict",
			secure: production,
		},
	});
}

export function adminPasswordMatches(candidate: string) {
	const expected = requiredEnvironmentVariable("ADMIN_PASSWORD");
	const candidateDigest = createHash("sha256").update(candidate).digest();
	const expectedDigest = createHash("sha256").update(expected).digest();
	return timingSafeEqual(candidateDigest, expectedDigest);
}
