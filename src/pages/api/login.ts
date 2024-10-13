
import { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from 'cookies-next';
import { supabseAuthClient } from '@/lib/supabase/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password } = req.body;
        try {
            const data = await supabseAuthClient.signIn(email, password);
            setCookie('access_token', data.session?.access_token, { req, res, maxAge: 60 * 60 * 24 * 30 });
            return res.status(200).json({ data, message: 'Login successful' });
        } catch (e) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
