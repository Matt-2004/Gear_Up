import crypto from "crypto"

// Use environment variable for encryption key, fallback to a default for development
const ENCRYPTION_KEY =
	process.env.COOKIE_ENCRYPTION_KEY || "default-32-character-secret-key"
const ALGORITHM = "aes-256-cbc"

// Ensure key is 32 bytes for AES-256
const getKey = () => {
	const key = Buffer.from(ENCRYPTION_KEY)
	if (key.length < 32) {
		// Pad the key if it's too short
		return Buffer.concat([key, Buffer.alloc(32 - key.length)], 32)
	}
	return key.slice(0, 32)
}

export function encrypt(text: string): string {
	const iv = crypto.randomBytes(16)
	const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv)

	let encrypted = cipher.update(text, "utf8", "hex")
	encrypted += cipher.final("hex")

	// Return IV + encrypted data (separated by :)
	return iv.toString("hex") + ":" + encrypted
}

export function decrypt(encryptedData: string): string {
	const parts = encryptedData.split(":")
	if (parts.length !== 2) {
		throw new Error("Invalid encrypted data format")
	}

	const iv = Buffer.from(parts[0], "hex")
	const encrypted = parts[1]

	const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv)

	let decrypted = decipher.update(encrypted, "hex", "utf8")
	decrypted += decipher.final("utf8")

	return decrypted
}
