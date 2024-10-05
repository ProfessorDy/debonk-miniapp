import type { NextApiRequest, NextApiResponse } from "next";
import { UserSolSmartWalletClass } from "@/actions/solana-provider";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { solUsdPrice } = await UserSolSmartWalletClass.getSolPrice();
    res.status(200).json({ solUsdPrice });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: "Failed to fetch SOL price" });
  }
}
