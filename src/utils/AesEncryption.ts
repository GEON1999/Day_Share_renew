import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "crypto";
import { redirect } from "next/navigation";

const algorithm = "aes-256-cbc";
const key = scryptSync(
  process.env.AES_SECRET_KEY || "default_secret_key_32_bytes",
  "salt",
  32
);
const ivLength = 16; // For AES, this is always 16

const LOGIN_REDIRECT_URL = process.env.LOGIN_REDIRECT_URL || "/login";

const aes_encrypt = (plainText: string): string => {
  const iv = randomBytes(ivLength);
  const cipher = createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

const aes_decrypt = (cipherText: any): string => {
  if (!cipherText) {
    if (typeof window === "undefined") {
      redirect(LOGIN_REDIRECT_URL);
    } else if (typeof window !== "undefined") {
      window.location.href = LOGIN_REDIRECT_URL;
    }
    return "";
  }

  try {
    const [ivHex, encryptedTextHex] = cipherText.value.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const encryptedText = Buffer.from(encryptedTextHex, "hex");
    const decipher = createDecipheriv(algorithm, key, iv);
    const decrypted = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);
    return decrypted.toString("utf8");
  } catch (e) {
    redirect(LOGIN_REDIRECT_URL);
  }
};

export default {
  aes_encrypt,
  aes_decrypt,
};
