
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useDocumentUpload = () => {
  const { toast } = useToast();
  const [selectedPlaca, setSelectedPlaca] = useState('');
  const [documentTag, setDocumentTag] = useState('');
  const [customTag, setCustomTag] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [capturedFiles, setCapturedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const N8N_WEBHOOK_URL = 'https://n8n-n8n.wedii5.easypanel.host/webhook-test/555756a4-180f-4561-8dc8-f666cb0f0a11';

  const generateFileName = (originalName: string): string => {
    const today = new Date();
    const dateStr = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    const tag = documentTag === 'custom' ? customTag : documentTag;
    
    return `${tag}-${selectedPlaca}-${dateStr}${extension}`;
  };

  const getAllFiles = (): File[] => {
    const regularFiles = files ? Array.from(files) : [];
    return [...regularFiles, ...capturedFiles];
  };

  const validateForm = (): boolean => {
    if (!selectedPlaca) {
      toast({
        title: "Error de validación",
        description: "Debe seleccionar una placa",
        variant: "destructive",
      });
      return false;
    }
    
    if (!documentTag) {
      toast({
        title: "Error de validación",
        description: "Debe seleccionar un tipo de documento",
        variant: "destructive",
      });
      return false;
    }
    
    if (documentTag === 'custom' && !customTag.trim()) {
      toast({
        title: "Error de validación",
        description: "Debe ingresar una etiqueta personalizada",
        variant: "destructive",
      });
      return false;
    }
    
    const allFiles = getAllFiles();
    if (allFiles.length === 0) {
      toast({
        title: "Error de validación",
        description: "Debe seleccionar al menos un archivo o tomar una foto",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const submitDocuments = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const allFiles = getAllFiles();
      const formData = new FormData();
      
      allFiles.forEach(file => {
        const newFileName = generateFileName(file.name);
        formData.append('files', file, newFileName);
      });
      
      formData.append('selectedPlate', selectedPlaca);
      formData.append('documentTag', documentTag === 'custom' ? customTag : documentTag);
      formData.append('submissionDate', new Date().toLocaleDateString('es-ES'));
      
      console.log('Enviando documentos a n8n webhook:', N8N_WEBHOOK_URL);
      console.log('Datos a enviar:', {
        fileCount: allFiles.length,
        selectedPlate: selectedPlaca,
        documentTag: documentTag === 'custom' ? customTag : documentTag,
        submissionDate: new Date().toLocaleDateString('es-ES')
      });
      
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Respuesta de n8n:', result);
        
        toast({
          title: "Documentos enviados exitosamente",
          description: `Se enviaron ${allFiles.length} archivo(s) a Google Drive correctamente`,
        });

        // Reset form
        setSelectedPlaca('');
        setDocumentTag('');
        setCustomTag('');
        setFiles(null);
        setCapturedFiles([]);
      } else {
        throw new Error(`Error del servidor: ${response.status}`);
      }
      
    } catch (error) {
      console.error('Error al enviar documentos a n8n:', error);
      toast({
        title: "Error al enviar documentos",
        description: "No se pudo conectar con el sistema de almacenamiento. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};
