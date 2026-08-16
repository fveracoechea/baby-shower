import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { type FormEvent, useState } from "react";

import { LAMP_GLOW } from "#/components/landing/case-ui";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { getAdminStatus, loginAdmin } from "#/server/admin-auth";

export const Route = createFileRoute("/admin_/login")({
	loader: async () => {
		if (await getAdminStatus()) throw redirect({ to: "/admin" });
	},
	head: () => ({ meta: [{ title: "Admin access" }] }),
	component: AdminLoginPage,
});

function AdminLoginPage() {
	const login = useServerFn(loginAdmin);
	const navigate = useNavigate({ from: "/admin/login" });
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSubmitting(true);
		setError(null);
		try {
			await login({ data: { password } });
			await navigate({ to: "/admin" });
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Could not sign in");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<main className="relative grid min-h-svh place-items-center overflow-hidden px-4 py-16">
			<div aria-hidden className={LAMP_GLOW} />
			<Card className="relative z-10 w-full max-w-md">
				<CardHeader>
					<CardTitle>Admin access</CardTitle>
					<CardDescription>
						Enter the host password to open the Invitation ledger.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={submit} className="grid gap-4">
						<Label htmlFor="admin-password">Password</Label>
						<Input
							id="admin-password"
							type="password"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							autoComplete="current-password"
							required
						/>
						{error ? (
							<p role="alert" className="text-sm text-red-400">
								{error}
							</p>
						) : null}
						<Button type="submit" disabled={submitting}>
							{submitting ? "Signing in..." : "Sign in"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</main>
	);
}
