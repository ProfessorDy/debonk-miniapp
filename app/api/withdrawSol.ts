import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { webApp } = req.query;

  if (!webApp) {
    return res.status(400).json({ error: "WebApp is required" });
  }

  try {
    // Withdrawal logic here
    res.status(200).json({ message: "Withdrawal successful" });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: "Failed to process withdrawal" });
  }
}
