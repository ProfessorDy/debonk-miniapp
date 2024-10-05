"use server";

import { NextResponse } from "next/server";
import { getAddressFromTelegramId } from "@/actions/utils";
import { buyToken, BuyTokenInput, sellToken, SellTokenInput } from "@/actions";
import { getWebApp } from "@/utils/getWebApp";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const telegramId = searchParams.get("telegramId");
  const tokenAddress = searchParams.get("tokenAddress");
  const amountInSol = searchParams.get("amountInSol");
  const amountPercent = searchParams.get("amountPercent");
  const type = searchParams.get("type");
  const webApp = getWebApp();

  const params: SellTokenInput = {
    telegramId,
    amountInSol: Number(amountInSol),
    tokenAddress,
    amountPercent: Number(amountPercent),
    type: type as "PERCENT" | "AMOUNT",
    WebAppInitData: webApp.initData,
  };

  if (!telegramId) {
    return NextResponse.json(
      { error: "Telegram ID is required" },
      { status: 400 }
    );
  }

  try {
    const { status, result } = await sellToken(params);

    if (!status) {
      return NextResponse.json(
        { error: "Sell Transaction Failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("API error: ", error); // Log the error for debugging
    return NextResponse.json(
      { error: "Error: Sell Transaction Failed", details: error.message },
      { status: 500 }
    );
  }
}
