import { LAMP_GLOW, Stamp } from "#/components/landing/case-ui";
import { m } from "#/paraglide/messages";

/**
 * Signature element: the Secret Envelope opens on load.
 * step 0: sealed. step 1: flap rotates open, the letter rises, the wax seal
 * fades. step 2: the envelope falls away and the case contents take over.
 * All motion is gated behind motion-safe; reduced motion just cross-fades.
 */
export function EnvelopeIntro({ step }: { step: number }) {
	return (
		<div className="fixed inset-0 z-40 grid place-items-center overflow-hidden bg-gradient-to-b from-neutral-950 via-stone-950 to-black p-6">
			<div aria-hidden className={LAMP_GLOW} />
			<div className="relative flex flex-col items-center gap-12">
				<div
					className={
						step >= 2
							? "motion-safe:translate-y-[130vh] motion-safe:rotate-6 motion-safe:opacity-0 motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-in"
							: "motion-safe:transition-all motion-safe:duration-700"
					}
				>
					<div className="relative h-48 w-72 [perspective:900px] sm:h-56 sm:w-88">
						{/* envelope back */}
						<div className="absolute inset-0 bg-lamp/90 shadow-2xl" />
						{/* the letter inside */}
						<div
							className={`absolute inset-x-3 top-2 bottom-5 z-10 rounded-sm bg-amber-50 p-4 shadow-md motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out ${
								step >= 1 ? "motion-safe:-translate-y-[62%]" : ""
							}`}
						>
							<p className="font-mono text-[10px] tracking-[0.35em] text-stamp">
								{m.envelope_top_secret()}
							</p>
							<p className="mt-1 font-mono text-[10px] text-stone-500">
								{m.envelope_case_number()}
							</p>
							<p className="display-title mt-3 text-2xl text-case-ink">
								{m.beat2_title()}
							</p>
							<p className="mt-1 font-mono text-[11px] text-stone-600">
								{m.event_parents()}
							</p>
						</div>
						{/* envelope front pocket */}
						<div className="absolute inset-0 z-20 bg-case-paper-deep [clip-path:polygon(0_0,50%_48%,100%_0,100%_100%,0_100%)]" />
						{/* the flap, hinged on the top edge */}
						<div
							className={`absolute inset-x-0 top-0 z-30 h-[52%] origin-top bg-lamp [backface-visibility:hidden] [clip-path:polygon(0_0,100%_0,50%_100%)] motion-safe:transition-transform motion-safe:duration-700 ${
								step >= 1 ? "motion-safe:[transform:rotateX(170deg)]" : ""
							}`}
						/>
						{/* wax seal */}
						<div
							aria-hidden
							className={`absolute top-[46%] left-1/2 z-40 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-stamp font-mono text-lg text-amber-100 shadow-lg ring-4 ring-red-900/40 ${
								step >= 1
									? "motion-safe:scale-50 motion-safe:opacity-0 motion-safe:transition-all motion-safe:duration-500"
									: ""
							}`}
						>
							?
						</div>
						<Stamp className="absolute bottom-3 left-3 z-30 -rotate-6 border-stamp/70 text-stamp/70">
							{m.stamp_confidencial()}
						</Stamp>
					</div>
				</div>
				<p className="font-mono text-[11px] tracking-[0.4em] text-stone-500">
					{m.envelope_case_number()}
				</p>
			</div>
		</div>
	);
}
