import { QdrantClient } from '@qdrant/js-client-rest';
import { QdrantVectorStore } from 'llamaindex';

export const vectorStore = (userId: string) =>
  new QdrantVectorStore({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    collectionName: `${userId}_collection`,
  });

export const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});
