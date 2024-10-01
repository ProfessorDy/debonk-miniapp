//import crypto
import crypto from "node:crypto";
import { MasterSolSmartWalletClass } from "./solana-provider";
import { createHash } from "crypto";

const botToken = "REPLACE_WITH_THE_BOT_TOKEN";

export const verifyTelegramWebAppData = (telegramInitData: string) => {
  // The data is a query string, which is composed of a series of field-value pairs.
  const encoded = decodeURIComponent(telegramInitData);

  // HMAC-SHA-256 signature of the bot's token with the constant string WebAppData used as a key.
  const secret = crypto.createHmac("sha256", "WebAppData").update(botToken);

  // Data-check-string is a chain of all received fields'.
  const arr = encoded.split("&");
  const hashIndex = arr.findIndex((str) => str.startsWith("hash="));
  const hash = arr.splice(hashIndex)[0].split("=")[1];
  // Sorted alphabetically
  arr.sort((a, b) => a.localeCompare(b));
  // In the format key=<value> with a line feed character ('\n', 0x0A) used as separator
  // e.g., 'auth_date=<auth_date>\nquery_id=<query_id>\nuser=<user>
  const dataCheckString = arr.join("\n");

  // The hexadecimal representation of the HMAC-SHA-256 signature of the data-check-string with the secret key
  const _hash = crypto
    .createHmac("sha256", secret.digest())
    .update(dataCheckString)
    .digest("hex");

  // If hash is equal, the data may be used on your server.
  // Complex data types are represented as JSON-serialized objects.
  return _hash === hash;
};

export const wait = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

export const getAddressFromTelegramId = (telegramId: number) => {
  console.log("telegramId: ", telegramId);
  const walletClass = new MasterSolSmartWalletClass();
  const index = deriveUserIndex(telegramId.toString());
  const address = walletClass.solAddressFromSeed(index);
  return address;
};

export function deriveUserIndex(userId: string): number {
  const hashedId = hashUserId(userId);
  const largeInt = hexToInt(hashedId);
  return reduceToIndexRange(largeInt, MAX_INDEX);
}
// Define the range for non-hardened indices (0 to 2^31 - 1)
const MAX_INDEX = BigInt(2 ** 31);

/**
 * Hashes the user ID using SHA-256 and returns the resulting hash as a hex string.
 * @param userId - The user's unique identifier (e.g., Telegram ID).
 * @returns The SHA-256 hash of the user ID as a hexadecimal string.
 */
function hashUserId(userId: string): string {
  return createHash("sha256").update(userId.toString()).digest("hex");
}

/**
 * Converts a hexadecimal string to a large integer.
 * @param hexString - The hexadecimal string to convert.
 * @returns The integer representation of the hexadecimal string.
 */
function hexToInt(hexString: string): bigint {
  return BigInt("0x" + hexString);
}

/**
 * Reduces the large integer to fit within the allowed range for the derivation path index.
 * @param largeInt - The large integer to reduce.
 * @param modulo - The upper limit for the index range (2^31 in this case).
 * @returns The reduced index within the range of 0 to 2^31 - 1.
 */
function reduceToIndexRange(largeInt: bigint, modulo: bigint): number {
  return Number(largeInt % modulo);
}
