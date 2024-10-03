import type { NextApiRequest, NextApiResponse } from 'next';
import { getAddressFromTelegramId } from '@/actions/utils';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { telegramId } = req.query;

  if (!telegramId) {
    return res.status(400).json({ error: 'Telegram ID is required' });
  }

  try {
    const address = await getAddressFromTelegramId(Number(telegramId));
    res.status(200).json({ address });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch address' });
  }
}
