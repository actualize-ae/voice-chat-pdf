import { NextApiRequest, NextApiResponse } from 'next';
import { supabseAuthClient } from '@/lib/supabase/auth';
import { getCookie } from 'cookies-next';
import appConfig from '@/config/app-config';
import { chunkDocuments, getDocuments } from '@/lib/engine/loader';
import { initializeCollection, storeDocumentsInQdrant } from '@/lib/engine/qdrant';

const { tableName } = appConfig.supabase


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const {
    searchType,
    topK,
  } = req.body;

  try {
    const userId = getCookie('user_id', { req, res });
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    const { data: existingConfigs, error: fetchError } = await supabseAuthClient.supabase.from(tableName).select('configs').eq('user_id', userId)
    if (fetchError) {
      return res.status(422).json({ message: 'Something went wrong while searching configs' });
    }
    const finalConfig = {
      ...(existingConfigs?.at(0)?.configs || {}),
      searchType,
      topK,
    }
    const { error } = await supabseAuthClient.supabase
      .from(tableName)
      .update({
        configs: finalConfig,
      })
      .eq('user_id', userId);

    if (error) {
      return res.status(422).json({ message: 'Error updating document' });
    }

    return res
      .status(200)
      .json({ message: 'Search Configurations saved successfully' });
  } catch (error) {
    console.error('Error while saving configs', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
