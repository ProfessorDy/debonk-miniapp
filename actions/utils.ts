//import crypto
import crypto from "crypto";
import { MasterSolSmartWalletClass } from "./solana-provider";
import { createHash } from "crypto";
import { Keypair } from "@solana/web3.js";
import { TokenDetails } from "./types";
import {
  getTokenDetails_DEXSCREENER,
  getTokenDetails_DEXTOOLS,
} from "./dataService";

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

export const getAddressFromTelegramId = (telegramId: number): string | null => {
  try {
    console.log(
      "Starting getAddressFromTelegramId with telegramId: ",
      telegramId
    );

    const walletClass = new MasterSolSmartWalletClass();
    const index = deriveUserIndex(telegramId.toString());
    console.log("Derived user index: ", index);

    const address = walletClass.solAddressFromSeed(index);
    console.log("Generated address: ", address);

    return address;
  } catch (error) {
    console.error("Error in getAddressFromTelegramId: ", error);
    return null;
  }
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

export const getAllTheDataFromInitData = (initData: string) => {
  //!UNCOMPLETED FUNCTION
  const encoded = decodeURIComponent(initData);

  // Data-check-string is a chain of all received fields'.
  const arr = encoded.split("&");
  //get for hash
  const hashIndex = arr.findIndex((str) => str.startsWith("hash="));
  const hash = arr.splice(hashIndex)[0].split("=")[1];

  //get for hash
  const idIndex = arr.findIndex((str) => str.startsWith("id="));
  const id = arr.splice(idIndex)[0].split("=")[1];

  return { hash, id };
};

export const getPrivateKeyFromTelegramId = (telegramId: string): Keypair => {
  const walletClass = new MasterSolSmartWalletClass();
  const index = deriveUserIndex(telegramId.toString());
  const Keypair: Keypair = walletClass.solDeriveChildKeypair(index);
  return Keypair;
};

export const getTokenDetails = async (token: string): Promise<TokenDetails> => {
  const isAddress = MasterSolSmartWalletClass.validateSolAddress(token);
  if (!isAddress) {
    if (!token || !(token.length === 44)) {
      throw new Error("invalid_address");
    }
  }

  let data: TokenDetails;
  try {
    data = await getTokenDetails_DEXSCREENER(token);
    if (!data) {
      data = await getTokenDetails_DEXTOOLS(token);
      // console.log("data: ", data);
      data.source = "PUMPFUN";
      if (!data) {
        return null;
      }
    }
  } catch (error) {
    console.log("error: ", error);
    if (!data) {
      data = await getTokenDetails_DEXTOOLS(token);
      // console.log("data: ", data);
      data.source = "PUMPFUN";
      if (!data) {
        return null;
      }
    }
  }

  return data;
};

export function calculatePercentageChange(
  oldPrice: number,
  currentPrice: number
): number {
  const percentChange = ((currentPrice - oldPrice) / oldPrice) * 100;

  if (percentChange === Infinity) {
    return 0;
  }
  return Number(percentChange.toFixed(2));
}

const getPositionText = async (telegramId: string) => {
  const user = await getUserFromTelegramId(telegramId);
  const positions = user.positions.filter(
    (position) => position.isSimulation == false
  );
  const wallet = user.wallet.filter((wallet: Wallet) => wallet.isPrimary)[0];
  let text = "Active Positions:";

  const solPrice = await getSolPrice();
  if (positions.length < 1) {
    text += "\nNo active positions";
  }

  try {
    const tokenListPosition: { tokenName: string; address: string }[] = [];
    for (const position of positions) {
      const tokenDetails = await getTokenDetails(position.tokenAddress);
      tokenListPosition.push({
        tokenName: tokenDetails.name,
        address: position.tokenAddress,
      });
      const PNL_usd = await calculateProfitLoss(
        user.id,
        wallet.id,
        position.tokenAddress,
        tokenDetails.priceUsd.toString()
      );
      const PNL_sol = PNL_usd / solPrice;
      const PNL_Sol_percent = (
        (PNL_sol /
          (parseInt(position.amountHeld) * parseFloat(position.avgBuyPrice))) *
        solPrice *
        100
      ).toFixed(2);

      const balance = await getUserTokenBalance(
        position.tokenAddress,
        telegramId
      );
      const _balance = formatter({
        decimal: 5,
      }).format(balance);

      const currentPrice = formatter({
        decimal: 8,
      }).format(Number(tokenDetails.priceUsd.toString()));

      const ch = `${formatCurrencyWithoutDollarSign(
        balance * Number(tokenDetails.priceNative)
      )} SOL (${formatCurrency(balance * tokenDetails.priceUsd)})`;

      const PNL_usd_percent = (
        (PNL_usd /
          (parseInt(position.amountHeld) * parseFloat(position.avgBuyPrice))) *
        100
      ).toFixed(2);
      const nameWithLink = `[${position.tokenTicker}](https://t.me/${BOT_USERNAME}?start=token_${position.tokenAddress})`;
      text += `\n- ${nameWithLink} |  ${ch}\n`;
      text += `CA: \`${position.tokenAddress}\`\n`;
      text += ` 💎\n`;
      text += `  |-Current Price : $${currentPrice}\n`;
      text += `  |-MC: $${tokenDetails.mc}\n`;
      text += `  |-Capital: ${(
        (parseFloat(position.avgBuyPrice) * parseFloat(position.amountHeld)) /
        solPrice
      ).toFixed(2)} Sol ($${(
        parseFloat(position.avgBuyPrice) * parseFloat(position.amountHeld)
      ).toFixed(2)})\n`;
      text += `  |-Current value: ${ch}\n`;
      text += `  |-PNL USD: ${PNL_usd_percent}% ($${PNL_usd.toFixed()}) ${
        PNL_usd > 0 ? "🟩" : "🟥"
      }\n`;
      text += `  |-PNL SOL: ${PNL_Sol_percent}% (${PNL_sol.toFixed(2)} SOL) ${
        PNL_sol > 0 ? "🟩" : "🟥"
      }\n`;
    }

    text += `\n\n_Last refresh time : ${getCurrentDate()} UTC_`;

    return { text, tokenListPosition };
  } catch (error) {
    return { text: `could not get token Details`, tokenListPosition: [] };
  }
};
