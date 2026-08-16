import {
	createFileRoute,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { InvitationManager } from "#/components/admin/invitation-manager";
import {
	addInvitation,
	editInvitation,
	getAdminView,
	removeInvitation,
} from "#/server/admin";
import { logoutAdmin, requireAdminPage } from "#/server/admin-auth";

export const Route = createFileRoute("/admin")({
	loader: async () => {
		await requireAdminPage();
		return getAdminView();
	},
	head: () => ({
		meta: [
			{ title: "Invitation ledger" },
			{ name: "description", content: "Manage event Invitations" },
		],
	}),
	component: AdminPage,
});

function AdminPage() {
	const view = Route.useLoaderData();
	const router = useRouter();
	const navigate = useNavigate({ from: "/admin" });
	const add = useServerFn(addInvitation);
	const edit = useServerFn(editInvitation);
	const remove = useServerFn(removeInvitation);
	const logout = useServerFn(logoutAdmin);

	async function refresh() {
		await router.invalidate();
	}

	return (
		<InvitationManager
			view={view}
			onLogout={async () => {
				await logout();
				await navigate({ to: "/admin/login" });
			}}
			onAdd={async (input) => {
				await add({ data: input });
				await refresh();
			}}
			onEdit={async (input) => {
				await edit({ data: input });
				await refresh();
			}}
			onRemove={async (id) => {
				await remove({ data: { id, confirmed: true } });
				await refresh();
			}}
		/>
	);
}
