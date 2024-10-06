"use server";

import { NextResponse } from "next/server";
import { getUserSolBalance } from "@/actions/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const telegramId = searchParams.get("telegramId");

  if (!telegramId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const balance = await getUserSolBalance(telegramId);
    return NextResponse.json({ balance });
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet balance" },
      { status: 500 }
    );
  }
}
