import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";

const makeCollectionName = (userId: string) => `${userId}_voice_app`

export const initializeCollection = async ({
  userId,
  embeddingModel,
  openAIApiKey
}: {
  embeddingModel: string,
  openAIApiKey: string
  userId: string
}) => {
  const embeddings = new OpenAIEmbeddings({
    model: embeddingModel,
    apiKey: openAIApiKey
  })
  const collectionName = makeCollectionName(userId)
  const store = new QdrantVectorStore(embeddings, {
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    collectionName,
  })
  await store.client.deleteCollection(collectionName)
  await store.ensureCollection()
  return store
}

export const storeDocumentsInQdrant = async ({
  documents,
  store
}: {
  documents: Document[],
  store: QdrantVectorStore
}) => {
  await store.addDocuments(documents)
  return store
}

export const searchQueryInQdrant = async ({
  userId,
  query,
  embeddingModel,
  openAIApiKey,
  topK
}: {
  userId: string,
  query: string,
  openAIApiKey: string,
  embeddingModel: string,
  topK: number
}) => {
  const collectionName = makeCollectionName(userId)
  const embeddings = new OpenAIEmbeddings({
    model: embeddingModel,
    apiKey: openAIApiKey
  })
  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: process.env.QDRANT_URL,
      collectionName,
    }
  );

  const response = await vectorStore.similaritySearch(query, topK);

  return response
}

