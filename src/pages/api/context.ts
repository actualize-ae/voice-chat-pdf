import type { NextApiRequest, NextApiResponse } from 'next';
import { CohereRerank } from 'llamaindex';
import { getDataSource } from '../../lib/engine';
import { getCookie } from 'cookies-next';
import { supabseAuthClient } from '@/lib/supabase/auth';

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  try {
    const { query } = req.query;
    const userId = getCookie('user_id', { req, res });
    if (!userId) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (typeof query !== 'string' || query.trim() === '') {
      console.log('[context] Invalid query parameter');
      return res.status(400).json({
        message: "A valid 'query' string parameter is required in the URL",
      });
    }

    console.log(`[context] Processing query: "${query}"`);

    const [index, dt] = await Promise.all([
      getDataSource(userId),
      supabseAuthClient.supabase
        .from('documents')
        .select('configs')
        .eq('user_id', userId)
        .single(),
    ]);

    const { topK, useReranking, rerankingResults } = dt.data?.configs || {
      topK: 2,
      useReranking: true,
      rerankingResults: 2,
    };
    console.log('[context] topK: ', topK, useReranking, rerankingResults);
    if (!index) {
      throw new Error(
        `StorageContext is empty - call 'npm run generate' to generate the storage first`,
      );
    }

    const retriever = index.asRetriever();

    const queryEngine = index.asQueryEngine({
      similarityTopK: topK,
      retriever,
      nodePostprocessors: [],
    });

    if (useReranking) {
      const reranker = new CohereRerank({
        apiKey: process.env.COHERE_API_KEY || '',
        topN: rerankingResults,
      });
      queryEngine.nodePostprocessors.push(reranker);
    }

    const response = await queryEngine.query({
      query,
    });

    res.status(200).json({
      message: `For improving the answer to my last question use the following context:
---------------------
${response.message.content}
---------------------`,
    });
  } catch (error) {
    console.error('[context] Error:', error);
    return res.status(500).json({
      message: (error as Error).message,
    });
  }
}
