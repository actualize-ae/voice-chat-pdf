'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { NavbarComponent } from '@/components/navbar';
import toast from 'react-hot-toast';

export default function GenerateEmbeddingsComponent() {
  const [documents, setDocuments] = useState<{ id: string; url: string }[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<
    { id: string; url: string }[]
  >([]);
  const [topK, setTopK] = useState(5);
  const [useReranking, setUseReranking] = useState(false);
  const [rerankingResults, setRerankingResults] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/fetch-documents');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      } else {
        console.error('Failed to fetch documents');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleDocumentSelection = (document: { id: string; url: string }) => {
    setSelectedDocuments((prev) =>
      prev.includes(document)
        ? prev.filter((doc) => doc.id !== document.id)
        : [...prev, document],
    );
  };

  const handleGenerateEmbeddings = async () => {
    if (selectedDocuments.length === 0) {
      toast.error('Please select at least one document');
      return;
    }

    setIsGenerating(true);
    setResult(null);

    try {
      const response = await fetch('/api/generate-embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documents: selectedDocuments.map((doc) => doc.id),
          topK,
          useReranking,
          rerankingResults: useReranking ? rerankingResults : undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(JSON.stringify(data, null, 2));
      } else {
        throw new Error('Failed to generate embeddings');
      }
    } catch (error) {
      console.error('Error generating embeddings:', error);
      setResult('Error generating embeddings. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  console.log('selected', selectedDocuments);

  return (
    <>
      <NavbarComponent />
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
            Generate Embeddings
          </h1>
          <div className="bg-white shadow-xl rounded-lg overflow-hidden p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Select Documents</h2>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center">
                    <Checkbox
                      id={doc.id}
                      checked={selectedDocuments.some((d) => d.id === doc.id)}
                      onCheckedChange={() => handleDocumentSelection(doc)}
                    />
                    <Label htmlFor={doc.id} className="ml-2">
                      {doc.id}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <Label
                htmlFor="topK"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Top-K Results: {topK}
              </Label>
              <Slider
                id="topK"
                min={1}
                max={20}
                step={1}
                value={[topK]}
                onValueChange={(value) => setTopK(value[0])}
                className="w-full"
              />
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="reranking"
                  className="text-sm font-medium text-gray-700"
                >
                  Use Reranking
                </Label>
                <Switch
                  id="reranking"
                  checked={useReranking}
                  onCheckedChange={setUseReranking}
                />
              </div>
            </div>
            {useReranking && (
              <div className="mb-6">
                <Label
                  htmlFor="rerankingResults"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Reranking Results Count
                </Label>
                <Input
                  id="rerankingResults"
                  type="number"
                  min={1}
                  max={topK}
                  value={rerankingResults}
                  onChange={(e) =>
                    setRerankingResults(
                      Math.min(parseInt(e.target.value) || 1, topK),
                    )
                  }
                  className="w-full"
                />
              </div>
            )}
            <Button
              onClick={handleGenerateEmbeddings}
              disabled={isGenerating || selectedDocuments.length === 0}
              className="w-full"
            >
              {isGenerating ? 'Generating...' : 'Generate Embeddings'}
            </Button>
            {result && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Result:</h3>
                <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                  {result}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
