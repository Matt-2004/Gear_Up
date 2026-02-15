import { decrypt } from "./encryption"

export async function getDecryptedUserData(
	encryptedData: string | undefined,
): Promise<{ userId: string; role: string } | null> {
	if (!encryptedData) {
		return null
	}

	try {
		return await decrypt(encryptedData)
	} catch (error) {
		console.error("Failed to decrypt user_id cookie:", error)
		return null
	}
}
