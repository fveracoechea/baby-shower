/**
 * nameKey: the identity key of a guest, derived from their name.
 * Trimmed, internal whitespace collapsed to single spaces, Unicode
 * case-folded. Accents stay significant ("Jose" != "Jose" with an accent).
 */
export function toNameKey(name: string): string {
	return name.trim().replace(/\s+/g, " ").toLowerCase();
}
