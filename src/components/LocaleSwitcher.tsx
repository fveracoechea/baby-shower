import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import { m } from "#/paraglide/messages";
import { getLocale, isLocale, locales, setLocale } from "#/paraglide/runtime";

/** EN lives at /, ES at /es; setLocale navigates to the localized URL. */
export default function LocaleSwitcher() {
	const current = getLocale();

	return (
		<div className="pointer-events-auto rounded-md border border-stone-700 bg-stone-950/85 p-0.5 shadow-lg backdrop-blur-sm">
			<ToggleGroup
				type="single"
				value={current}
				onValueChange={(next) => {
					if (isLocale(next) && next !== current) setLocale(next);
				}}
				aria-label={m.locale_switcher_label()}
				spacing={1}
				className="gap-0"
			>
				{locales.map((locale) => (
					<ToggleGroupItem
						key={locale}
						value={locale}
						className="h-6 rounded-[3px] px-2 font-mono text-[10px] uppercase tracking-wider text-stone-400 hover:bg-transparent hover:text-amber-100 data-[state=on]:bg-lamp data-[state=on]:text-stone-950 aria-pressed:bg-lamp aria-pressed:text-stone-950"
					>
						{locale}
					</ToggleGroupItem>
				))}
			</ToggleGroup>
		</div>
	);
}
