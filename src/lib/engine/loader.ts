import { supabseAuthClient } from '@/lib/supabase/auth';
import { PDFReader } from 'llamaindex/readers/PDFReader';

export async function getDocuments(userId: string) {
  const { data: userDocs } = await supabseAuthClient.supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .select('documents');
  if (!userDocs?.length) throw new Error('No docs found');
  const docIds = userDocs.flatMap((doc) => doc.documents);

  const allUserDocs = await Promise.all(
    docIds.map(async (docId) => {
      const docFileName = docId.split('/').at(-1);
      const { data: doc } = await supabseAuthClient.supabase.storage
        .from('audio-kb')
        .download(docFileName);
      return doc;
    }),
  );

  const sanitizedDocs = await Promise.all(
    allUserDocs.map((doc) => doc?.arrayBuffer()),
  );

  const documents = await Promise.all(
    sanitizedDocs
      .filter((doc) => doc)
      .map(async (downloadedDoc) => {
        return new PDFReader().loadDataAsContent(
          new Uint8Array(downloadedDoc!),
        );
      }),
  );

  const flatMapDocs = documents.flatMap((doc) => doc);
  return flatMapDocs;
}
