import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import { m } from "#/paraglide/messages";
import { getLocale, isLocale, locales, setLocale } from "#/paraglide/runtime";

/** EN lives at /, ES at /es; setLocale navigates to the localized URL. */
export default function LocaleSwitcher() {
	const current = getLocale();

	return (
		<div className="pointer-events-auto rounded-md border border-stone-700 bg-stone-950/85 shadow-lg backdrop-blur-sm">
			<ToggleGroup
				size="sm"
				variant="nav"
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
					<ToggleGroupItem key={locale} value={locale} className="min-w-0 px-2">
						{locale}
					</ToggleGroupItem>
				))}
			</ToggleGroup>
		</div>
	);
}
