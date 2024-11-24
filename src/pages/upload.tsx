'use client';

import { AppDock } from '@/components/navigation/AppDock';
import { DotPattern } from '@/components/ui/dot-pattern';
import ShineBorder from '@/components/ui/shine-border';
import { fetchDocuments, linkDocuments, unlinkDocuments } from '@/lib/api/utils';
import { cn, uploadFile } from '@/lib/utils';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import toast, { Toaster } from 'react-hot-toast';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { MagicCard } from "@/components/ui/magic-card";
import { AnimatedList } from "@/components/ui/animated-list";
import { useConfettiFireworks } from '@/hooks/use-confetti-fireworks';
import { AlertWarning } from '@/components/alerts/AlertWarning';
import PulsatingButton from '@/components/ui/pulsating-button';
import { IconTrash } from '@tabler/icons-react';
import appConfig from '@/config/app-config';
import Stepper from '@/components/forms/Stepper';
import { GenerateEmbeddingsForm } from '@/components/forms/GenerateEmbeddings';
import { Search } from 'lucide-react';
import { SearchConfigurationForm } from '@/components/forms/SearchConfiguration';

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


export default function PdfUploader() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [documents, setDocuments] = useState<{ id: string; url: string }[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<{
    id: string | null;
    url: string;
  }>({
    id: null,
    url: '',
  });

  const handleDocumentClick = (document: any) => {
    setSelectedDocument(document);
    setPdfFile(null);
    setPageNumber(1);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setUploadSuccess(false);
    } else {
      alert('Please upload a PDF file');
    }
  }, []);

  async function fetchAndSetDocuments() {
    try {
      const docs = await fetchDocuments()
      setDocuments(docs as any);
    } catch (e) {
      toast.error("Something went wrong while fetching documents, please refresh the page")
    }

  }

  useEffect(() => {
    fetchAndSetDocuments()
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const handleUpload = async () => {
    if (!pdfFile) return;

    setUploading(true);
    try {
      const { fullPath } = await uploadFile(pdfFile);
      await linkDocuments(fullPath);
      setUploadSuccess(true);
      triggerConfetti()
      fetchAndSetDocuments()
      setPdfFile(null)
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const { triggerConfetti } = useConfettiFireworks({})
  return (
    <>
      <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8">
        <AppDock />
        <Toaster position="top-right" reverseOrder={false} />
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]",
          )}
        />
        <Stepper steps={[
          {
            label: 'Upload Documents',
            content: <MagicCard
              className="cursor-pointer w-full flex-col items-center justify-center shadow-2xl whitespace-nowrap text-lg"
              gradientColor={"#D9D9D955"}
            >

              <div className="w-full rounded-lg overflow-hidden">
                <div className="md:flex">
                  <div className='w-1/2 p-6'>
                    <div>
                      <AlertWarning title='Disclaimer' description='The documents uploaded here will be stored in public bucket.' />
                      <div
                        {...getRootProps()}
                        className={`border-2 mt-2 border-dashed h-64 rounded-lg p-8 text-center cursor-pointer transition duration-300 ease-in-out ${isDragActive
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                          }`}
                      >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                          <p className="text-blue-500">Drop the PDF file here...</p>
                        ) : (
                          <p className="text-gray-500 text-sm">
                            Drag and drop a PDF file here, or click to select a file
                          </p>
                        )}
                      </div>

                      {pdfFile && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-500">
                            File: <span className="font-medium">{pdfFile.name}</span>
                          </p>
                          <PulsatingButton
                            onClick={handleUpload}
                            disabled={uploading}
                            className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out disabled:opacity-50"
                          >
                            {uploading ? 'Uploading...' : 'Upload to Server'}
                          </PulsatingButton>
                          {uploadSuccess && (
                            <p className="mt-2 text-green-500 text-sm">
                              File uploaded successfully!
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-8">
                      <h2 className="text-lg font-semibold mb-4">
                        Uploaded Documents
                      </h2>
                      <AnimatedList className="p-4 max-h-96 overflow-auto space-y-2">
                        {documents.map((doc) => (
                          <li
                            key={doc.id}
                            onClick={() => handleDocumentClick(doc)}
                            className={`cursor-pointer flex p-2 rounded-md ${selectedDocument.id === doc.id
                              ? 'bg-blue-100'
                              : 'hover:bg-gray-100'
                              }`}
                          >

                            <Document
                              file={doc.url}
                              className="scale-y-[0.04] scale-x-[0.08] relative top-[-0.6rem] mr-10 w-8 h-4"
                              onLoadSuccess={onDocumentLoadSuccess}
                            >
                              <Page pageNumber={1} />
                            </Document>
                            {doc.id}
                            <IconTrash className='ml-auto' onClick={async (e) => {
                              e.stopPropagation()
                              await unlinkDocuments(`${appConfig.supabase.bucketName}/${doc.id}`)
                              await fetchAndSetDocuments()
                            }} />
                          </li>
                        ))}
                      </AnimatedList>
                    </div>
                  </div>
                  <div className="md:w-1/2 max-h-[70vh] overflow-auto p-6 bg-gray-50">
                    {pdfFile || selectedDocument.id ? (
                      <div>
                        <Document
                          file={pdfFile || selectedDocument.url}
                          onLoadSuccess={onDocumentLoadSuccess}
                        >
                          <Page pageNumber={pageNumber} />
                        </Document>
                        <div className="mt-4 flex justify-between items-center">
                          <button
                            onClick={() =>
                              setPageNumber((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={pageNumber <= 1}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
                          >
                            Previous
                          </button>
                          <p className="text-gray-600">
                            Page {pageNumber} of {numPages}
                          </p>
                          <button
                            onClick={() =>
                              setPageNumber((prev) =>
                                Math.min(prev + 1, numPages || 1),
                              )
                            }
                            disabled={pageNumber >= (numPages || 1)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-gray-400">
                          PDF preview will appear here
                        </p>
                      </div>
                    )}
                  </div>


                </div>


              </div>
            </MagicCard >
          },
          {
            label: 'Generate Embeddings',
            content: <ShineBorder
            className="relative p-8 flex w-[60%] ml-[20%] h-[65vh] flex-col items-center justify-center overflow-scroll rounded-lg border-2 bg-white md:shadow-2xl"
            color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          >
            <GenerateEmbeddingsForm />
          </ShineBorder>
          },
          { label: 'Configure Search Parameters', content:  <ShineBorder
            className="relative p-8 flex w-[60%] ml-[20%] h-[65vh] flex-col items-center justify-center overflow-scroll rounded-lg border-2 bg-white md:shadow-2xl"
            color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          >
            <SearchConfigurationForm />
          </ShineBorder> },
        ]} />


      </div >


    </>
  );
}
