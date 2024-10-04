import type { NextApiRequest, NextApiResponse } from "next";
import { getAddressFromTelegramId } from "@/actions/utils";
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
