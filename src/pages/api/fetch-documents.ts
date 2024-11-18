import type { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';
import { supabseAuthClient } from '@/lib/supabase/auth';
import appConfig from '@/config/app-config';

const { tableName, bucketName } = appConfig.supabase

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const userId = getCookie('user_id', { req, res });
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    const { data, error } = await supabseAuthClient.supabase
      .from(tableName)
      .select()
      .eq('user_id', userId)
      .select('documents');
    if (error) {
      return res
        .status(422)
        .json({ success: false, message: 'Something went wrong' });
    }

    const finalDocs = data?.[0]?.documents || [];

    const docsWithUrl = await Promise.all(
      finalDocs.map(async (doc: string) => {
        const path = doc.split('/').at(-1);
        const { data } = await supabseAuthClient.supabase.storage
          .from(bucketName)
          .getPublicUrl(path || '');
        return {
          id: path,
          url: data.publicUrl,
        };
      }),
    );
    res.status(200).json(docsWithUrl || []);
  } catch (error) {
    console.error('Error reading uploads directory:', error);
    res.status(500).json({ message: 'Error fetching documents' });
  }
}
