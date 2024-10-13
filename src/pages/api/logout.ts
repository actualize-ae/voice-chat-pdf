import { NextApiRequest, NextApiResponse } from 'next';
import { deleteCookie } from 'cookies-next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'DELETE') {
    try {
      deleteCookie('access_token', { req, res });
      deleteCookie('user_id', { req, res });
      return res.status(200).json({ message: 'Logged Out successfully' });
    } catch (e) {
      res.status(401).json({ success: false, message: 'Invalid session' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
