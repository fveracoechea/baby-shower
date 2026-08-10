import { createFileRoute } from "@tanstack/react-router";

import { PrototypeSwitcher } from "#/components/prototype/mystery/switcher";
import { VariantBoard } from "#/components/prototype/mystery/variant-board";
import { VariantMansion } from "#/components/prototype/mystery/variant-mansion";
import { VariantNoir } from "#/components/prototype/mystery/variant-noir";
import { VariantRedacted } from "#/components/prototype/mystery/variant-redacted";
import { VariantStorybook } from "#/components/prototype/mystery/variant-storybook";

/**
 * PROTOTYPE (throwaway): five animated takes on The Mystery.
 * Flip variants with ?variant=<key> or the floating switcher.
 */

const VARIANTS = [
	{ key: "noir", name: "The Detective's Desk", Component: VariantNoir },
	{ key: "storybook", name: "The Cozy Casebook", Component: VariantStorybook },
	{ key: "mansion", name: "Whodunit at the Manor", Component: VariantMansion },
	{ key: "redacted", name: "Declassified", Component: VariantRedacted },
	{ key: "board", name: "The Evidence Board", Component: VariantBoard },
] as const;

type VariantKey = (typeof VARIANTS)[number]["key"];

const KEYS = VARIANTS.map((v) => v.key) as readonly string[];

const isVariantKey = (key: string): key is VariantKey => KEYS.includes(key);

export const Route = createFileRoute("/prototype/mystery")({
	validateSearch: (search): { variant: VariantKey } => ({
		variant: isVariantKey(String(search.variant))
			? (search.variant as VariantKey)
			: "noir",
	}),
	component: MysteryPrototype,
});

function MysteryPrototype() {
	const { variant } = Route.useSearch();
	const navigate = Route.useNavigate();
	const current =
		VARIANTS.find((v) => v.key === variant) ??
		(VARIANTS[0] as (typeof VARIANTS)[number]);

	const selectVariant = (key: string) => {
		if (!isVariantKey(key)) return;
		void navigate({ search: { variant: key }, replace: true });
	};

	return (
		<>
			<current.Component />
			{import.meta.env.DEV ? (
				<PrototypeSwitcher
					variants={VARIANTS}
					current={current.key}
					onSelect={selectVariant}
				/>
			) : null}
		</>
	);
}
