import type { NextApiRequest, NextApiResponse } from "next";
import { getAddressFromTelegramId, getTokenDetails } from "@/actions/utils";
import { UserSolSmartWalletClass } from "@/actions/solana-provider";
export async function getWalletAddress(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { telegramId } = req.query;

  if (!telegramId) {
    return res.status(400).json({ error: "Telegram ID is required" });
  }

  try {
    const address = await getAddressFromTelegramId(Number(telegramId));
    res.status(200).json({ address });
  } catch (error) {
    console.log("error: ", error);
    //eslint-disable-line
    res.status(500).json({ error: "Failed to fetch address" });
  }
}

export async function withdrawSOl(req: NextApiRequest, res: NextApiResponse) {
  const { webApp } = req.query;

  if (!webApp) {
    return res.status(400).json({ error: "Telegram ID is required" });
  }

  try {
  } catch (error) {
    console.log("error: ", error);
    //eslint-disable-line
    res.status(500).json({ error: "Failed to fetch address" });
  }
}

export async function getSOlPrice(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { solUsdPrice } = await UserSolSmartWalletClass.getSolPrice();
    res.status(200).json({ solUsdPrice });
  } catch (error) {
    console.log("error: ", error);
    //eslint-disable-line
    res.status(500).json({ error: "Failed to fetch address" });
  }
}

export async function getTokenDetailsApi(
  req: NextApiRequest,
  res: NextApiResponse,
  tokenAddress: string
) {
  try {
    const tokenDetails = await getTokenDetails(tokenAddress);
    if (tokenDetails) {
      res.status(200).json({ tokenDetails });
    }
  } catch (error) {
    console.log("error: ", error);
    if (error.message === "invalid_address") {
      res.status(400).json({ error: "Invalid token address" });
    }
    //eslint-disable-line
    res.status(500).json({ error: "Failed to fetch address" });
  }
}
