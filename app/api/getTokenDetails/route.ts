"use server";

import { NextResponse } from "next/server";
import { getTokenDetails } from "@/actions/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tokenAddress = searchParams.get("tokenAddress");

  if (!tokenAddress) {
    return NextResponse.json(
      { error: "Token address is required" },
      { status: 400 }
    );
  }

  try {
    const tokenDetails = await getTokenDetails(tokenAddress);

    if (tokenDetails) {
      return NextResponse.json({ tokenDetails });
    } else {
      return NextResponse.json(
        { error: "Token not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("API error: ", error);
    return NextResponse.json(
      { error: "Failed to fetch token details", details: error.message },
      { status: 500 }
    );
  }
}
