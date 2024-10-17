import { VectorStoreIndex } from 'llamaindex';
import { storageContextFromDefaults } from 'llamaindex/storage/StorageContext';
import * as dotenv from 'dotenv';

import { getDocuments } from './loader';
import { initSettings } from './settings';
import { vectorStore } from './qdrant';

// Load environment variables from local .env file
dotenv.config();

async function getRuntime(func: any) {
  const start = Date.now();
  await func();
  const end = Date.now();
  return end - start;
}

async function generateDatasource({
  userId,
}: {
  userId: string;
}) {
  // Split documents, create embeddings and store them in the storage context
  const ms = await getRuntime(async () => {
    try {
      const storageContext = await storageContextFromDefaults({
        vectorStore: vectorStore(userId),
      });
      const documents = await getDocuments(userId);

      const index = await VectorStoreIndex.fromDocuments(documents, {
        storageContext,
      });
    } catch (e) {
      console.error('Error generating storage context:', e);
    }
  });
  console.log(`Storage context successfully generated in ${ms / 1000}s.`);
}

export async function generateEmbeddings({
  userId,
}: {
  userId: string;
}) {
  initSettings();
  generateDatasource({
    userId,
  });
}
