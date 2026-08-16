import { ExternalLink, Gift, Shirt } from "lucide-react";

import { cn } from "#/lib/utils";
import { m } from "#/paraglide/messages";

const REGISTRY_URL = "https://my.babylist.com/nf-baby-registry";

/** Public dress-code and gift notes shared by the Invitation and Reveal. */
export function EventNotes({ stacked = false }: { stacked?: boolean }) {
	return (
		<div
			className={cn(
				"grid gap-4 border-t border-stone-900/15 py-5",
				!stacked && "sm:grid-cols-2",
			)}
		>
			<div className="flex gap-3">
				<span className="grid size-9 shrink-0 place-items-center rounded-full border border-stone-900/20 bg-amber-50/70 text-stamp">
					<Shirt className="size-4" aria-hidden />
				</span>
				<div className="flex flex-col gap-1.5">
					<h3 className="font-mono text-xs leading-relaxed text-stone-500">
						{m.reveal_dress_code_label()}
					</h3>
					<p className="font-mono text-sm leading-relaxed text-stone-800">
						{m.event_dress_code()}
					</p>
				</div>
			</div>
			<div className="flex gap-3">
				<span className="grid size-9 shrink-0 place-items-center rounded-full border border-stone-900/20 bg-amber-50/70 text-stamp">
					<Gift className="size-4" aria-hidden />
				</span>
				<div className="flex flex-col gap-1.5">
					<h3 className="font-mono text-xs leading-relaxed text-stone-500">
						{m.reveal_registry_label()}
					</h3>
					<p className="font-mono text-sm leading-relaxed text-stone-700">
						{m.event_registry_note()}
					</p>
					<a
						href={REGISTRY_URL}
						target="_blank"
						rel="noreferrer"
						className="inline-flex w-fit items-center gap-1.5 font-mono text-sm leading-[normal] text-stone-800 underline decoration-stone-400 underline-offset-4 transition-colors hover:text-green-800"
					>
						{m.reveal_registry_cta()}
						<ExternalLink className="size-3.5" aria-hidden />
					</a>
				</div>
			</div>
		</div>
	);
}
