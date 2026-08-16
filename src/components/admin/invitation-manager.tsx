import { type FormEvent, useState } from "react";

import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Select } from "#/components/ui/select";
import type { AdminView, InvitationStatus } from "#/server/admin";

type InvitationInput = {
	name: string;
	phoneNumber: string;
	additionalGuestAllowance: number;
};

type EditingInvitation = InvitationInput & { id: number };

interface InvitationManagerProps {
	view: AdminView;
	onAdd(input: InvitationInput): Promise<void> | void;
	onEdit(input: EditingInvitation): Promise<void> | void;
	onRemove(id: number): Promise<void> | void;
	onLogout(): Promise<void> | void;
}

const statusLabels: Record<InvitationStatus, string> = {
	"awaiting-response": "Awaiting response",
	attending: "Attending",
	declined: "Declined",
};

function emptyInvitation(): InvitationInput {
	return { name: "", phoneNumber: "", additionalGuestAllowance: 0 };
}

export function InvitationManager({
	view,
	onAdd,
	onEdit,
	onRemove,
	onLogout,
}: InvitationManagerProps) {
	const [form, setForm] = useState<InvitationInput>(emptyInvitation);
	const [editing, setEditing] = useState<number | null>(null);
	const [removing, setRemoving] = useState<
		AdminView["invitations"][number] | null
	>(null);
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	function startEdit(invitation: AdminView["invitations"][number]) {
		setEditing(invitation.id);
		setForm({
			name: invitation.name,
			phoneNumber: invitation.phoneNumber,
			additionalGuestAllowance: invitation.additionalGuestAllowance,
		});
		setError(null);
	}

	function cancelEdit() {
		setEditing(null);
		setForm(emptyInvitation());
		setError(null);
	}

	async function save(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSaving(true);
		setError(null);
		try {
			if (editing === null) await onAdd(form);
			else await onEdit({ ...form, id: editing });
			cancelEdit();
		} catch (cause) {
			setError(
				cause instanceof Error
					? cause.message
					: "Could not save the Invitation.",
			);
		} finally {
			setSaving(false);
		}
	}

	async function confirmRemoval() {
		if (!removing) return;
		setSaving(true);
		setError(null);
		try {
			await onRemove(removing.id);
			setRemoving(null);
		} catch (cause) {
			setError(
				cause instanceof Error
					? cause.message
					: "Could not remove the Invitation.",
			);
		} finally {
			setSaving(false);
		}
	}

	return (
		<main className="mx-auto w-full max-w-6xl px-4 py-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:fill-mode-backwards motion-safe:duration-500 sm:px-6 sm:py-12">
			<header className="relative border-b border-lamp/30 pb-6 pr-24">
				<Button
					type="button"
					variant="text"
					onClick={onLogout}
					className="absolute top-0 right-0 font-mono text-xs uppercase tracking-widest text-stone-400 underline underline-offset-4"
				>
					Sign out
				</Button>
				<p className="typewriter text-xs uppercase tracking-[0.28em] text-lamp">
					Case file 19
				</p>
				<h1 className="display-title mt-2 text-4xl text-case-paper sm:text-5xl">
					Invitation ledger
				</h1>
				<p className="mt-2 max-w-2xl text-sm leading-6 text-stone-400">
					Manage Invitation access. RSVP responses remain the Guest&apos;s
					record.
				</p>
			</header>

			<section
				aria-label="Invitation summary"
				className="mt-6 grid grid-cols-2 border border-lamp/30 bg-stone-950 sm:grid-cols-4 lg:grid-cols-7"
			>
				<Summary label="Invitations" value={view.summary.invitationCount} />
				<Summary label="Awaiting" value={view.summary.awaitingResponseCount} />
				<Summary label="Attending" value={view.summary.attendingCount} />
				<Summary label="Declined" value={view.summary.declinedCount} />
				<Summary label="Headcount" value={view.summary.headcount} />
				<Summary label="Girl theories" value={view.summary.girlTheoryCount} />
				<Summary label="Boy theories" value={view.summary.boyTheoryCount} />
			</section>

			<section className="mt-8 grid gap-8 lg:grid-cols-[20rem_1fr]">
				<form
					onSubmit={save}
					className="h-fit border border-lamp/30 bg-stone-900/80 p-5 shadow-[8px_8px_0_rgba(185,28,28,0.2)]"
				>
					<h2 className="display-title text-2xl text-case-paper">
						{editing === null ? "Add Invitation" : "Edit Invitation"}
					</h2>
					<p className="mt-1 text-xs leading-5 text-stone-400">
						Phone numbers are stored in normalized US format.
					</p>
					<fieldset disabled={saving} className="mt-5 grid gap-4">
						<Field
							label="Guest name"
							value={form.name}
							onChange={(name) => setForm({ ...form, name })}
							autoComplete="name"
						/>
						<Field
							label="Phone number"
							value={form.phoneNumber}
							onChange={(phoneNumber) => setForm({ ...form, phoneNumber })}
							autoComplete="tel"
							type="tel"
						/>
						<Label variant="field" className="grid gap-1.5">
							Additional-guest allowance
							<Select
								value={form.additionalGuestAllowance}
								onChange={(event) =>
									setForm({
										...form,
										additionalGuestAllowance: Number(event.target.value),
									})
								}
							>
								{[0, 1, 2, 3].map((value) => (
									<option key={value} value={value}>
										{value}
									</option>
								))}
							</Select>
						</Label>
					</fieldset>
					{editing !== null &&
					view.invitations.find((invitation) => invitation.id === editing)
						?.status !== "awaiting-response" ? (
						<p className="mt-4 border-l-2 border-stamp pl-3 text-xs leading-5 text-stone-300">
							The RSVP status is read-only for hosts.
						</p>
					) : null}
					{error ? (
						<p role="alert" className="mt-4 text-sm text-red-300">
							{error}
						</p>
					) : null}
					<div className="mt-5 flex flex-wrap gap-3">
						<Button type="submit" size="lg">
							{saving
								? "Saving..."
								: editing === null
									? "Add Invitation"
									: "Save changes"}
						</Button>
						{editing !== null ? (
							<Button
								type="button"
								variant="outline"
								size="lg"
								onClick={cancelEdit}
							>
								Cancel
							</Button>
						) : null}
					</div>
				</form>

				<section aria-labelledby="invitations-heading" className="min-w-0">
					<div className="mb-3 flex items-baseline justify-between gap-4">
						<h2
							id="invitations-heading"
							className="display-title text-2xl text-case-paper"
						>
							Invitations
						</h2>
						<span className="typewriter text-xs text-stone-500">
							{view.summary.invitationCount} filed
						</span>
					</div>
					<div className="overflow-x-auto border border-stone-700 bg-stone-950">
						<table className="w-full min-w-[44rem] border-collapse text-left text-sm">
							<thead className="typewriter bg-stone-900 text-[11px] uppercase tracking-[0.14em] text-stone-400">
								<tr>
									<th className="p-3">Guest</th>
									<th className="p-3">Phone</th>
									<th className="p-3">Allowance</th>
									<th className="p-3">RSVP</th>
									<th className="p-3">Headcount</th>
									<th className="p-3">
										<span className="sr-only">Actions</span>
									</th>
								</tr>
							</thead>
							<tbody>
								{view.invitations.map((invitation) => (
									<tr
										key={invitation.id}
										className="border-t border-stone-800 text-stone-200"
									>
										<td className="p-3 font-medium text-case-paper">
											{invitation.name}
										</td>
										<td className="p-3 font-mono text-xs">
											{invitation.phoneNumber}
										</td>
										<td className="p-3">
											{invitation.additionalGuestAllowance}
										</td>
										<td className="p-3">
											<Status status={invitation.status} />
										</td>
										<td className="p-3">
											{invitation.partySize === null
												? "-"
												: `${invitation.partySize} (${invitation.additionalGuestsAttending} additional)`}
										</td>
										<td className="p-3">
											<div className="flex gap-2">
												<Button
													type="button"
													variant="text"
													onClick={() => startEdit(invitation)}
													className="text-xs"
												>
													Edit
												</Button>
												<Button
													type="button"
													variant="dangerText"
													onClick={() => setRemoving(invitation)}
													aria-label={`Remove ${invitation.name}`}
													className="text-xs"
												>
													Remove
												</Button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			</section>

			{removing ? (
				<div
					role="dialog"
					aria-modal="true"
					aria-labelledby="remove-title"
					className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4"
				>
					<Card variant="destructive" className="w-full max-w-md p-6">
						<h2
							id="remove-title"
							className="display-title text-2xl text-case-paper"
						>
							Remove Invitation?
						</h2>
						<p className="mt-3 text-sm leading-6 text-stone-300">
							Remove {removing.name}&apos;s Invitation
							{removing.status === "awaiting-response"
								? "?"
								: " and the RSVP filed with it?"}{" "}
							This cannot be undone.
						</p>
						<div className="mt-6 flex flex-wrap gap-3">
							<Button
								type="button"
								variant="destructive"
								size="lg"
								disabled={saving}
								onClick={confirmRemoval}
							>
								Remove Invitation
							</Button>
							<Button
								type="button"
								variant="outline"
								size="lg"
								disabled={saving}
								onClick={() => setRemoving(null)}
							>
								Cancel
							</Button>
						</div>
					</Card>
				</div>
			) : null}
		</main>
	);
}

function Field({
	label,
	value,
	onChange,
	autoComplete,
	type = "text",
}: {
	label: string;
	value: string;
	onChange(value: string): void;
	autoComplete: string;
	type?: "text" | "tel";
}) {
	return (
		<Label variant="field" className="grid gap-1.5">
			{label}
			<Input
				required
				type={type}
				value={value}
				onChange={(event) => onChange(event.target.value)}
				autoComplete={autoComplete}
			/>
		</Label>
	);
}

function Summary({ label, value }: { label: string; value: number }) {
	return (
		<div className="border-b border-r border-stone-800 p-3 last:border-r-0 lg:border-b-0">
			<dt className="typewriter text-[10px] uppercase tracking-[0.12em] text-stone-500">
				{label}
			</dt>
			<dd className="display-title mt-1 text-2xl text-case-paper">{value}</dd>
		</div>
	);
}

function Status({ status }: { status: InvitationStatus }) {
	const variant =
		status === "attending"
			? "attending"
			: status === "declined"
				? "declined"
				: "awaiting";
	return <Badge variant={variant}>{statusLabels[status]}</Badge>;
}
