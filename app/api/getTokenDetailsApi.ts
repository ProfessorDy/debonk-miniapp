import type { NextApiRequest, NextApiResponse } from "next";
import { getTokenDetails } from "@/actions/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tokenAddress } = req.query;

  if (!tokenAddress) {
    return res.status(400).json({ error: "Token address is required" });
  }

  try {
    const tokenDetails = await getTokenDetails(tokenAddress as string);
    if (tokenDetails) {
      res.status(200).json({ tokenDetails });
    } else {
      res.status(404).json({ error: "Token not found" });
    }
  } catch (error) {
    console.log("error: ", error);
    if (error.message === "invalid_address") {
      res.status(400).json({ error: "Invalid token address" });
    } else {
      res.status(500).json({ error: "Failed to fetch token details" });
    }
  }
}
