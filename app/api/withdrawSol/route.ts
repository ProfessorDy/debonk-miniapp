import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { webApp } = body;

    // Check if webApp data exists
    if (!webApp) {
      return NextResponse.json({ error: "WebApp data is required" }, { status: 400 });
    }

    // You can extract specific fields from the webApp object here
    const { userId, firstName, lastName, balance } = webApp; // Example fields

    // Perform your withdrawal logic using the webApp data
    console.log(`Processing withdrawal for user: ${firstName} ${lastName} with ID: ${userId} and balance: ${balance}`);

    // Return a success response
    return NextResponse.json({ message: "Withdrawal successful", balance }, { status: 200 });

  } catch (error) {
    console.error("Error processing withdrawal:", error);
    return NextResponse.json({ error: "Failed to process withdrawal" }, { status: 500 });
  }
}
