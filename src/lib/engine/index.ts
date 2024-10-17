import { VectorStoreIndex } from 'llamaindex';
import { storageContextFromDefaults } from 'llamaindex/storage/StorageContext';
import { vectorStore } from './qdrant';
import { getDocuments } from './loader';

export async function getDataSource(userId: string) {
  const storageContext = await storageContextFromDefaults({
    vectorStore: vectorStore(userId),
  });
  const documents = await getDocuments(userId);
  return await VectorStoreIndex.fromDocuments(documents, {
    storageContext,
  });
}
