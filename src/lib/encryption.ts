import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const PREFIX = "enc:";

function getEncryptionKey(keyStr: string): Buffer {
  return crypto.createHash("sha256").update(keyStr).digest();
}

export function encryptPassword(password: string): { encrypted: string; keyUsed: string } {
  const keyStr = process.env.PASSWORD_ENCRYPTION_KEY;
  if (!keyStr) {
    throw new Error("No PASSWORD_ENCRYPTION_KEY defined in environment");
  }
  const key = getEncryptionKey(keyStr);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");
  return {
    encrypted: PREFIX + iv.toString("hex") + ":" + encrypted,
    keyUsed: keyStr,
  };
}

export function decryptPassword(encryptedText: string): string {
  if (!encryptedText.startsWith(PREFIX)) {
    throw new Error("Not an encrypted password");
  }
  const keyStr = process.env.PASSWORD_ENCRYPTION_KEY;
  if (!keyStr) {
    throw new Error("No PASSWORD_ENCRYPTION_KEY defined in environment");
  }
  const key = getEncryptionKey(keyStr);
  const data = encryptedText.slice(PREFIX.length);
  const parts = data.split(":");
  if (parts.length !== 2) {
    throw new Error("Invalid encrypted format");
  }
  const iv = Buffer.from(parts[0], "hex");
  const encrypted = parts[1];
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
