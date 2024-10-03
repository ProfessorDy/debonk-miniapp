import type { NextApiRequest, NextApiResponse } from 'next';
import { getAddressFromTelegramId } from '@/actions/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { telegramId } = req.query;

  if (!telegramId) {
    return res.status(400).json({ error: 'Telegram ID is required' });
  }

  try {
    const address = await getAddressFromTelegramId(Number(telegramId));
    
    if (!address) {
      return res.status(500).json({ error: 'Address generation failed' });
    }

    res.status(200).json({ address });
  } catch (error) {
    console.error("API error: ", error);  // Log the error for debugging
    res.status(500).json({ error: 'Failed to fetch address', details: error.message });
  }
}
