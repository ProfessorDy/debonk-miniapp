"use server";

import { NextResponse } from "next/server";
import { WithdrawalInput, withdrawSOl } from "@/actions";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const telegramId = searchParams.get("telegramId");
  const amount = searchParams.get("amount");
  const destinationAddress = searchParams.get("destinationAddress");
  // const webApp = getWebApp();

  const params: WithdrawalInput = {
    telegramId,
    amount: Number(amount),
    destinationAddress,
    WebAppInitData: "webApp.initData",
  };

  if (!telegramId) {
    return NextResponse.json(
      { error: "Telegram ID is required" },
      { status: 400 }
    );
  }

  try {
    const res = await withdrawSOl(params);

    if (!res) {
      return NextResponse.json(
        { error: "Withdrawal Transaction Failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ res });
  } catch (error) {
    console.error("API error: ", error); // Log the error for debugging
    return NextResponse.json(
      {
        error: "Error: Withdrawal Transaction Failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
