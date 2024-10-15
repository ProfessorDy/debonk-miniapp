"use server";

import { NextResponse } from "next/server";
import { buyToken, BuyTokenInput } from "@/actions";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const telegramId = searchParams.get("telegramId");
  const amountInSol = searchParams.get("amountInSol");
  const tokenAddress = searchParams.get("tokenAddress");
  // const webApp = getWebApp();

  const params: BuyTokenInput = {
    telegramId,
    amountInSol: Number(amountInSol),
    tokenAddress,
    WebAppInitData: "webApp.initData",
  };

  if (!telegramId) {
    return NextResponse.json(
      { error: "Telegram ID is required" },
      { status: 400 }
    );
  }

  try {
    const { status, result } = await buyToken(params);

    if (!status) {
      return NextResponse.json(
        { error: "Buy Transaction Failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("API error: ", error); // Log the error for debugging
    return NextResponse.json(
      { error: "Error: Buy Transaction Failed", details: error.message },
      { status: 500 }
    );
  }
}
