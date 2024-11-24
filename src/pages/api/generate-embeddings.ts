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

  const { useReranking,
    topK,
    rerankingResults,
    chunkOverlap,
    chunkSize,
    apiKey,
    embeddingModel,
    embeddingDimension,
    embeddingInfo
  } = req.body;

  try {
    const userId = getCookie('user_id', { req, res });
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    // Load documents
    const docsWithLoader = await getDocuments(userId)
    // Chunk documents
    const chunkedDocuments = await chunkDocuments({
      docsWithLoader,
      chunkOverlap,
      chunkSize
    })
    const store = await initializeCollection({
      userId,
      embeddingModel: embeddingInfo?.name,
      openAIApiKey: apiKey
    })
    for (let doc in chunkedDocuments) {
      await storeDocumentsInQdrant({
        documents: chunkedDocuments[doc].chunks,
        store
      })
    }
    const { error } = await supabseAuthClient.supabase
      .from(tableName)
      .update({
        configs: {
          useReranking,
          topK,
          rerankingResults,
          chunkOverlap,
          chunkSize,
          embeddingModel,
          embeddingDimension,
          embeddingInfo
        },
      })
      .eq('user_id', userId);

    if (error) {
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
