import type { NextApiRequest, NextApiResponse } from 'next';
import { Settings } from 'llamaindex';
import { getCookie } from 'cookies-next';
import { supabseAuthClient } from '@/lib/supabase/auth';
import { qdrantClient } from '@/lib/engine/qdrant';
import { cohereClient } from '@/lib/engine/cohere';
import appConfig from '@/config/app-config';

const { tableName } = appConfig.supabase

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  try {
    const { query } = req.query;
    let finalChunkText = '';
    const userId = getCookie('user_id', { req, res });
    if (!userId) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (typeof query !== 'string' || query.trim() === '') {
      console.log('[context] Invalid query parameter');
      return res.status(400).json({
        message: "A valid 'query' string parameter is required in the URL"
      });
    }

    console.log(`[context] Processing query: "${query}"`);

    const dt = await supabseAuthClient.supabase
      .from(tableName)
      .select('configs')
      .eq('user_id', userId)
      .single();

    const { topK, useReranking, rerankingResults } = dt.data?.configs || {
      topK: 2,
      useReranking: true,
      rerankingResults: 1,
    };
    const queryEmbedding = await Settings.embedModel.getQueryEmbedding({
      text: query,
      type: 'text',
    });

    if (!queryEmbedding) {
      return res.status(400).json({
        message: 'Failed to get query embedding',
      });
    }
    const qdrantResponse = await qdrantClient.query(
      `${userId}_collection`,
      {
        query: queryEmbedding,
        limit: topK,
        with_payload: true,
      }
    );

    const documentChunks = qdrantResponse.points.map((chunk) => JSON.parse(chunk.payload?._node_content as string).text);

    if (useReranking) {
      const rerankedDocumentResults = await cohereClient.rerank({
        query,
        documents: documentChunks,
        topN: rerankingResults,
        returnDocuments: false,
      });
      const rerankedDocumentChunks = rerankedDocumentResults.results.map((result) => documentChunks[result.index]);
      finalChunkText = rerankedDocumentChunks.join('\n');
    } else {
      finalChunkText = documentChunks.join('\n');
    }

    return res.status(200).json({
      message: `For improving the answer to my last question use the following context:
          ---------------------
          ${finalChunkText}
          ---------------------`
    });
  } catch (error) {
    console.error('[context] Error:', error);
    return res.status(500).json({
      message: (error as Error).message,
    });
  }
}
