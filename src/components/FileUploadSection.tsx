
import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, CheckCircle, Camera } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FileUploadSectionProps {
  files: FileList | null;
  capturedFiles: File[];
  onFileChange: (files: FileList | null) => void;
  onCapturedFilesChange: (files: File[]) => void;
  onRemoveFile: (index: number, isCapture?: boolean) => void;
}

export const FileUploadSection = ({
  files,
  capturedFiles,
  onFileChange,
  onCapturedFilesChange,
  onRemoveFile
}: FileUploadSectionProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const invalidFiles = Array.from(selectedFiles).filter(file => !validTypes.includes(file.type));
      
      if (invalidFiles.length > 0) {
        toast({
          title: "Tipo de archivo no válido",
          description: "Solo se permiten archivos JPG, PNG y PDF",
          variant: "destructive",
        });
        return;
      }
      
      onFileChange(selectedFiles);
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const capturedFilesList = e.target.files;
    if (capturedFilesList) {
      const newFiles = Array.from(capturedFilesList);
      onCapturedFilesChange([...capturedFiles, ...newFiles]);
      
      toast({
        title: "Foto capturada",
        description: `Se capturó ${newFiles.length} foto(s) correctamente`,
      });
    }
  };

  const openCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const getAllFiles = (): File[] => {
    const regularFiles = files ? Array.from(files) : [];
    return [...regularFiles, ...capturedFiles];
  };

  const allFiles = getAllFiles();

  return (
    <div className="space-y-4">
      <Label>Adjuntar Documentos</Label>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 border-2 border-gray-400 hover:border-gray-600 text-white"
        >
          <FileText className="h-4 w-4 mr-2 text-white" />
          Seleccionar Archivos
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={openCamera}
          className="flex-1 bg-yellow-500 hover:bg-yellow-600 border-2 border-yellow-500"
        >
          <Camera className="h-4 w-4 mr-2 text-gray-700" />
          <span className="text-gray-700">Tomar Foto</span>
        </Button>
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      <Input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraCapture}
        className="hidden"
      />

      <div className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center">
        <div className="flex justify-center space-x-4 mb-4">
          <FileText className="h-8 w-8 text-gray-400" />
          <Camera className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-sm text-gray-400">
          Seleccione archivos desde su dispositivo o tome fotos con la cámara
          <br />
          <span className="text-xs text-gray-500">JPG, PNG, PDF - Múltiples archivos permitidos</span>
        </p>
      </div>
      
      {allFiles.length > 0 && (
        <Alert className="border-2 border-green-400">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="font-medium">
                {allFiles.length} archivo(s) seleccionado(s):
              </div>
              
              {files && Array.from(files).map((file, index) => (
                <div key={`file-${index}`} className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-300">
                  <span>📄 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFile(index, false)}
                    className="text-red-500 hover:text-red-700 p-1 h-auto"
                  >
                    ✕
                  </Button>
                </div>
              ))}
              
              {capturedFiles.map((file, index) => (
                <div key={`capture-${index}`} className="flex items-center justify-between text-sm text-gray-600 bg-yellow-50 p-2 rounded border border-yellow-300">
                  <span>📷 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFile(index, true)}
                    className="text-red-500 hover:text-red-700 p-1 h-auto"
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
