import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import { m } from "#/paraglide/messages";
import { getLocale, isLocale, locales, setLocale } from "#/paraglide/runtime";

/**
 * Floating locale pill, visible on every state of the landing.
 * EN lives at /, ES at /es; setLocale navigates to the localized URL.
 */
export default function LocaleSwitcher() {
	const current = getLocale();

	return (
		<div className="fixed top-4 right-4 z-50 rounded-full border border-stone-700 bg-stone-950/85 p-1 shadow-lg backdrop-blur-sm">
			<ToggleGroup
				type="single"
				value={current}
				onValueChange={(next) => {
					if (isLocale(next) && next !== current) setLocale(next);
				}}
				aria-label={m.locale_switcher_label()}
				spacing={0}
				className="gap-0"
			>
				{locales.map((locale) => (
					<ToggleGroupItem
						key={locale}
						value={locale}
						className="rounded-full px-3 font-mono text-xs uppercase tracking-widest text-stone-400 hover:bg-transparent hover:text-amber-100 data-[state=on]:bg-lamp data-[state=on]:text-stone-950 aria-pressed:bg-lamp aria-pressed:text-stone-950"
					>
						{locale}
					</ToggleGroupItem>
				))}
			</ToggleGroup>
		</div>
	);
}
