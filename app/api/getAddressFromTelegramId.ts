"use server"

import { NextResponse } from 'next/server';
import { getAddressFromTelegramId } from '@/actions/utils';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const telegramId = searchParams.get('telegramId');

  if (!telegramId) {
    return NextResponse.json({ error: 'Telegram ID is required' }, { status: 400 });
  }

  try {
    const address = await getAddressFromTelegramId(Number(telegramId));

    if (!address) {
      return NextResponse.json({ error: 'Address generation failed' }, { status: 500 });
    }

    return NextResponse.json({ address });
  } catch (error) {
    console.error("API error: ", error); // Log the error for debugging
    return NextResponse.json({ error: 'Failed to fetch address', details: error.message }, { status: 500 });
  }
}