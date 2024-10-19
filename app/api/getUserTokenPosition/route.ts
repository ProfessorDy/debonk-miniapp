"use server";

import { NextResponse } from "next/server";

import { getUserTokenPosition } from "@/actions";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const telegramId = searchParams.get("telegramId");
  const tokenAddress = searchParams.get("tokenAddress");

  if (!telegramId) {
    return NextResponse.json(
      { error: "Telegram ID is required" },
      { status: 400 }
    );
  }

  try {
    const position = await getUserTokenPosition(telegramId, tokenAddress);

    return NextResponse.json({ position });
  } catch (error) {
    console.error("API error: ", error); // Log the error for debugging
    return NextResponse.json(
      { error: "Failed to get user token position", details: error.message },
      { status: 500 }
    );
  }
}
