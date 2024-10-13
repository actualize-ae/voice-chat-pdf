
import { NextApiRequest, NextApiResponse } from 'next';
import { generateEmbeddings } from '../engine/generate';
import { supabseAuthClient } from '@/lib/supabase/auth';
import { getCookie } from 'cookies-next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { useReRanking, topK, topN } = req.body;



    try {
        const accessToken = getCookie('access_token', { req, res });
        const user = await supabseAuthClient.supabaseAuth.getUser(accessToken);
        if (!user.data.user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        if (!accessToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Generate embeddings
        await generateEmbeddings({
            userId: user.data.user.id,
            useReRanking,
            topK,
            topN
        });

        return res.status(200).json({ message: 'Embeddings generated successfully' });
    } catch (error) {
        console.error('Error generating embeddings:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
