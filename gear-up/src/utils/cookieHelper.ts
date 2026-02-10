import { decrypt } from "./encryption"

export function getDecryptedUserId(
	encryptedUserId: string | undefined,
): string | null {
	if (!encryptedUserId) {
		return null
	}

	try {
		return decrypt(encryptedUserId)
	} catch (error) {
		console.error("Failed to decrypt user_id cookie:", error)
		return null
	}
}
