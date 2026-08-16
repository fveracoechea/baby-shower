/** Converts a US phone number to the Invitation lookup form, or rejects it. */
export function normalizeUsPhoneNumber(value: string): string | null {
	const digits = value.replace(/\D/g, "");
	const nationalNumber =
		digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

	if (nationalNumber.length !== 10 || /^[01]/.test(nationalNumber)) {
		return null;
	}

	return `+1${nationalNumber}`;
}
