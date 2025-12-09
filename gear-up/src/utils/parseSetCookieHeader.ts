// lib/parseCookies.ts
export function parseSetCookieHeader(setCookieHeader: string | null) {
	if (!setCookieHeader) return {}

	const cookies: Record<string, string> = {}

	// Split cookies by comma only if followed by a space + word (next cookie name)
	// This safely handles commas inside date fields
	const cookieParts = setCookieHeader.split(/,(?=\s*[a-zA-Z0-9_\-]+=)/)

	for (const part of cookieParts) {
		const match = part.match(/^\s*([^=]+)=([^;]+)/)
		if (match) {
			const [, key, value] = match
			cookies[key.trim()] = value.trim()
		}
	}

	return cookies
}
