"use server";

import { NextResponse } from "next/server";
import { getUserTokenBalance } from "@/actions/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const telegramId = searchParams.get("telegramId");
  const tokenAddress = searchParams.get("tokenAddress");

  if (!telegramId || !tokenAddress) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const balance = await getUserTokenBalance(tokenAddress, telegramId);
    return NextResponse.json({ balance });
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet balance" },
      { status: 500 }
    );
  }
}
