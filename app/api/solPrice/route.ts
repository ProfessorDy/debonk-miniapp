import { NextResponse } from "next/server";
import { UserSolSmartWalletClass } from "@/actions/solana-provider";

export async function GET() {
  try {
    const { solUsdPrice } = await UserSolSmartWalletClass.getSolPrice();
    return NextResponse.json({ solUsdPrice });
  } catch (error) {
    console.error("Error fetching SOL price:", error);
    return NextResponse.json({ error: "Failed to fetch SOL price" }, { status: 500 });
  }
}