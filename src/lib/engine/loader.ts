import appConfig from '@/config/app-config';
import { supabseAuthClient } from '@/lib/supabase/auth';
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from '@langchain/core/documents';

const { bucketName, tableName } = appConfig.supabase

export async function getDocuments(userId: string) {
  const { data: userDocs } = await supabseAuthClient.supabase
    .from(tableName)
    .select('*')
    .eq('user_id', userId)
    .select('documents');
  if (!userDocs?.length) throw new Error('No docs found');
  const docIds = userDocs.flatMap((doc) => doc.documents);

  const allUserDocs = await Promise.all(
    docIds.map(async (docId) => {
      const docFileName = docId.split('/').at(-1);
      const { data: doc } = await supabseAuthClient.supabase.storage
        .from(bucketName)
        .download(docFileName);
      return doc;
    }),
  );


  const docsWithLoader = await Promise.all(
    allUserDocs.reduce<{
      content: Blob,
      loader: WebPDFLoader
    }[]>((acc, doc) => {
      if (!doc) return [...acc];
      const loader = new WebPDFLoader(doc);
      return [
        ...acc,
        {
          content: doc,
          loader
        }
      ]
    }, []),
  );
  return docsWithLoader
}

export async function chunkDocuments({ docsWithLoader, chunkOverlap, chunkSize }: {
  docsWithLoader: {
    content: Blob;
    loader: WebPDFLoader;
  }[], chunkSize: number, chunkOverlap: number
}) {
  const chunkedDocuments = await Promise.all(
    docsWithLoader
      .map(async ({ loader, content }) => {
        const document = await loader.load()
        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize,
          chunkOverlap,
        });
        const chunks = await textSplitter.splitDocuments(document)
        return {
          content,
          chunks
        }
      }),
  );
  return chunkedDocuments;
}

export async function generateEmbeddingforChunks({ documents, apiKey, model }: {
  documents: {
    content: Blob;
    chunks: Document<Record<string, any>>[];
  }[],
  apiKey: string, model: string
}) {
  const embeddings = await Promise.all(
    documents
      .map(async ({ chunks }) => {
        return generateEmbeddings({ apiKey, model, texts: chunks.map((chunk) => chunk.pageContent) })
      }),
  );
  return embeddings as number[][][];
}

export function generateEmbeddingforQuery({ query, apiKey, model }: {
  query: string,
  apiKey: string,
  model: string,
}) {
  return generateEmbeddings({ apiKey, model, texts: [query], type: "query" })
}

export async function generateEmbeddings({ apiKey, model, texts, type = "document" }: {
  apiKey: string,
  model: string,
  texts: string[],
  type?: "document" | "query"
}) {
  const embeddings = new OpenAIEmbeddings({
    apiKey,
    model,
    dimensions: 1024
  });
  switch (type) {
    case "document":
      return embeddings.embedDocuments(texts)
    case "query":
      return embeddings.embedQuery(texts.at(0) || "")
    default:
      return embeddings.embedDocuments(texts)
  }
}