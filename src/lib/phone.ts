/** Removes display formatting and produces the Invitation lookup form. */
export function normalizePhoneNumber(value: string): string | null {
	const digits = value.replace(/\D/g, "");
	if (!digits) return null;

	const hasExplicitCountryCode = value.trimStart().startsWith("+");
	if (!hasExplicitCountryCode && digits.length === 10) return `+1${digits}`;
	return `+${digits}`;
}
