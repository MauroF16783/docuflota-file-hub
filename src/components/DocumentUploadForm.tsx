
import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from 'lucide-react';
import { VehicleSelector } from './VehicleSelector';
import { DocumentTypeSelector } from './DocumentTypeSelector';
import { FileUploadSection } from './FileUploadSection';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';

const DocumentUploadForm = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const {
    selectedPlaca,
    setSelectedPlaca,
    documentTag,
    setDocumentTag,
    customTag,
    setCustomTag,
    files,
    setFiles,
    capturedFiles,
    setCapturedFiles,
    isLoading,
    submitDocuments,
  } = useDocumentUpload();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitDocuments();
    
    // Clear file inputs
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const removeFile = (index: number, isCapture: boolean = false) => {
    if (isCapture) {
      setCapturedFiles(prev => prev.filter((_, i) => i !== index));
    } else {
      if (files) {
        const dt = new DataTransfer();
        Array.from(files).forEach((file, i) => {
          if (i !== index) dt.items.add(file);
        });
        setFiles(dt.files.length > 0 ? dt.files : null);
        if (fileInputRef.current) {
          fileInputRef.current.files = dt.files;
        }
      }
    }
  };

  return (
    <Card className="max-w-2xl mx-auto border-2 border-gray-300 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Formulario de Carga de Documentos</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <VehicleSelector 
            selectedPlaca={selectedPlaca}
            onPlacaChange={setSelectedPlaca}
          />

          <DocumentTypeSelector
            selectedPlaca={selectedPlaca}
            documentTag={documentTag}
            customTag={customTag}
            onDocumentTagChange={setDocumentTag}
            onCustomTagChange={setCustomTag}
          />

          <FileUploadSection
            files={files}
            capturedFiles={capturedFiles}
            onFileChange={setFiles}
            onCapturedFilesChange={setCapturedFiles}
            onRemoveFile={removeFile}
          />

          <Button 
            type="submit" 
            className="w-full text-black hover:opacity-90 border-2 border-yellow-500"
            style={{ backgroundColor: '#DEDA00' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent mr-2"></div>
                Enviando a Google Drive...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Cargar Documentos
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DocumentUploadForm;
