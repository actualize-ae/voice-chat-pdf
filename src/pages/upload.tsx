'use client';

import { NavbarComponent } from '@/components/navbar';
import { fetchDocuments, linkDocuments } from '@/lib/api/utils';
import { uploadFile } from '@/lib/utils';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

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

  useEffect(() => {
    fetchDocuments().then((docs) => {
      console.log('docs are', docs);
      setDocuments(docs as any);
    });
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
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <NavbarComponent />
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
            PDF Uploader and Viewer
          </h1>
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-6">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition duration-300 ease-in-out ${
                    isDragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="text-blue-500">Drop the PDF file here...</p>
                  ) : (
                    <p className="text-gray-500">
                      Drag and drop a PDF file here, or click to select a file
                    </p>
                  )}
                </div>
                {pdfFile && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      File: <span className="font-medium">{pdfFile.name}</span>
                    </p>
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out disabled:opacity-50"
                    >
                      {uploading ? 'Uploading...' : 'Upload to Server'}
                    </button>
                    {uploadSuccess && (
                      <p className="mt-2 text-green-500 text-sm">
                        File uploaded successfully!
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-4">
                    Uploaded Documents
                  </h2>
                  <ul className="space-y-2">
                    {documents.map((doc) => (
                      <li
                        key={doc.id}
                        onClick={() => handleDocumentClick(doc)}
                        className={`cursor-pointer p-2 rounded-md ${
                          selectedDocument.id === doc.id
                            ? 'bg-blue-100'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {doc.id}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="md:w-1/2 p-6 bg-gray-50">
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
        </div>
      </div>
    </>
  );
}
