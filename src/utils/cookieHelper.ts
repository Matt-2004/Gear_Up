import { UserItem } from "@/types/user.types";
import { decrypt } from "./encryption";

export async function getDecryptedUserData(
  encryptedData: string | undefined,
): Promise<{ userId: string; role: string } | null> {
  if (!encryptedData) {
    return null;
  }

  try {
    return await decrypt(encryptedData);
  } catch (error) {
    console.error("Failed to decrypt user_id cookie:", error);
    return null;
  }
}

export async function getDecryptedFullUserData(
  encryptedData: string | undefined,
): Promise<{ userId: string; role: string } | null> {
  if (!encryptedData) {
    return null;
  }

  try {
    const decrypted = await decrypt(encryptedData);
    return decrypted;
  } catch (error) {
    console.error("Failed to decrypt user_data cookie:", error);
    return null;
  }
}
