"use server";

import { NextResponse } from "next/server";

import { getUserActivePositions } from "@/actions";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const telegramId = searchParams.get("telegramId");

  if (!telegramId) {
    return NextResponse.json(
      { error: "Telegram ID is required" },
      { status: 400 }
    );
  }

  try {
    const positions = await getUserActivePositions(telegramId);
    console.log("positions", positions)

    return NextResponse.json({ positions });
  } catch (error) {
    console.error("API error: ", error); // Log the error for debugging
    return NextResponse.json(
      { error: "Failed to get user positions", details: error.message },
      { status: 500 }
    );
  }
}
