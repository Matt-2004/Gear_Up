import { UserItem } from "@/types/user.types";

// Use environment variable for encryption key, fallback to a default for development
const ENCRYPTION_KEY =
  process.env.COOKIE_ENCRYPTION_KEY || "default-32-character-secret-key";

// Ensure key is 32 bytes for AES-256
async function getKey() {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(ENCRYPTION_KEY);

  // Pad or truncate to 32 bytes
  const keyBuffer = new Uint8Array(32);
  keyBuffer.set(keyData.slice(0, 32));

  return await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encrypt(data: UserItem): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 12 bytes for GCM

  const encoder = new TextEncoder();
  const text = JSON.stringify(data);
  const encodedText = encoder.encode(text);

  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encodedText,
  );

  // Convert to hex and return IV + encrypted data (separated by :)
  const ivHex = Array.from(iv)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const encryptedHex = Array.from(new Uint8Array(encryptedData))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return ivHex + ":" + encryptedHex;
}

export async function decrypt(
  encryptedData: string,
): Promise<{ userId: string; role: string } | null> {
  const parts = encryptedData.split(":");
  if (parts.length !== 2) {
    throw new Error("Invalid encrypted data format");
  }

  // Convert hex strings back to Uint8Array
  const iv = new Uint8Array(
    parts[0].match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
  );
  const encrypted = new Uint8Array(
    parts[1].match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
  );

  const key = await getKey();

  const decryptedData = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encrypted,
  );

  const decoder = new TextDecoder();
  const decryptedText = decoder.decode(decryptedData);

  return JSON.parse(decryptedText);
}
