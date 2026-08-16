import type * as React from "react";

import { cn } from "#/lib/utils.ts";

function Select({ className, ...props }: React.ComponentProps<"select">) {
	return (
		<select
			data-slot="select"
			className={cn(
				"h-11 rounded-md border border-stone-600 bg-stone-950 px-3 font-mono text-sm text-case-paper outline-none focus-visible:border-lamp focus-visible:ring-[3px] focus-visible:ring-lamp/30 disabled:pointer-events-none disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

export { Select };
