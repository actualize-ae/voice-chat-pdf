import { NextApiRequest, NextApiResponse } from 'next';
import { generateEmbeddings } from '../../lib/engine/generate';
import { supabseAuthClient } from '@/lib/supabase/auth';
import { getCookie } from 'cookies-next';
import appConfig from '@/config/app-config';

const { tableName } = appConfig.supabase

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { useReranking, topK, rerankingResults } = req.body;

  try {
    const userId = getCookie('user_id', { req, res });
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    // Generate embeddings
    await generateEmbeddings({
      userId,
    });

    const { error } = await supabseAuthClient.supabase
      .from(tableName)
      .update({
        configs: {
          useReranking,
          topK,
          rerankingResults,
        },
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating document:', error);
      return res.status(422).json({ message: 'Error updating document' });
    }

    return res
      .status(200)
      .json({ message: 'Embeddings generated successfully' });
  } catch (error) {
    console.error('Error generating embeddings:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
