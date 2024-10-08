"use server";

import { NextResponse } from "next/server";
import { SellTokenInput, simulationBuy } from "@/actions";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  try {
    const telegramId = searchParams.get("telegramId");
    const tokenAddress = searchParams.get("tokenAddress");
    const amountInSol = searchParams.get("amountInSol");
    const amountPercent = searchParams.get("amountPercent");
    const type = searchParams.get("type");

    // const webApp = getWebApp();

    const params: SellTokenInput = {
      telegramId,
      amountInSol: Number(amountInSol),
      tokenAddress,
      amountPercent: Number(amountPercent),
      type: type as "PERCENT" | "AMOUNT",
      WebAppInitData: "",
    };

    if (!telegramId) {
      return NextResponse.json(
        { error: "Telegram ID is required" },
        { status: 400 }
      );
    }

    try {
      console.log("buying");
      const { status } = await simulationBuy(params);

      console.log("status", status);

      if (!status) {
        return NextResponse.json(
          { error: "Sell Transaction Failed" },
          { status: 500 }
        );
      }

      return NextResponse.json({ status });
    } catch (error) {
      console.error("API error: ", error); // Log the error for debugging
      return NextResponse.json(
        { error: "Error: Sell Transaction Failed", details: error.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.log("error: ", error);

    return NextResponse.json(
      { error: "Error: Internal server Error", details: error.message },
      { status: 500 }
    );
  }
}
