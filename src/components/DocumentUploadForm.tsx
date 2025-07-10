import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, Camera } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useVehiculos } from '@/hooks/useVehiculos';
import { useTiposDocumentos } from '@/hooks/useTiposDocumentos';

const DocumentUploadForm = () => {
  const { toast } = useToast();
  const [selectedPlaca, setSelectedPlaca] = useState('');
  const [placaSearch, setPlacaSearch] = useState('');
  const [documentTag, setDocumentTag] = useState('');
  const [customTag, setCustomTag] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [capturedFiles, setCapturedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Hooks para cargar datos de Supabase
  const { vehiculos, loading: loadingVehiculos } = useVehiculos();
  const { tiposDocumentos: tiposVehiculo, loading: loadingTiposVehiculo } = useTiposDocumentos('vehiculo');
  const { tiposDocumentos: tiposConductor, loading: loadingTiposConductor } = useTiposDocumentos('conductor');

  // Combinar todos los tipos de documentos
  const allTiposDocumentos = [...tiposVehiculo, ...tiposConductor];
  const loadingTipos = loadingTiposVehiculo || loadingTiposConductor;

  // Filtrar vehículos por búsqueda
  const filteredVehiculos = vehiculos.filter(vehiculo => 
    vehiculo.placa.toLowerCase().includes(placaSearch.toLowerCase())
  );

  // URL del webhook actualizada
  const N8N_WEBHOOK_URL = 'https://n8n-n8n.wedii5.easypanel.host/webhook-test/555756a4-180f-4561-8dc8-f666cb0f0a11';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      // Validar tipos de archivo
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
      
      setFiles(selectedFiles);
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const capturedFiles = e.target.files;
    if (capturedFiles) {
      const newFiles = Array.from(capturedFiles);
      setCapturedFiles(prev => [...prev, ...newFiles]);
      
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const allFiles = getAllFiles();
    
    // Validaciones
    if (!selectedPlaca) {
      toast({
        title: "Error de validación",
        description: "Debe seleccionar una placa",
        variant: "destructive",
      });
      return;
    }
    
    if (!documentTag) {
      toast({
        title: "Error de validación",
        description: "Debe seleccionar un tipo de documento",
        variant: "destructive",
      });
      return;
    }
    
    if (documentTag === 'custom' && !customTag.trim()) {
      toast({
        title: "Error de validación",
        description: "Debe ingresar una etiqueta personalizada",
        variant: "destructive",
      });
      return;
    }
    
    if (allFiles.length === 0) {
      toast({
        title: "Error de validación",
        description: "Debe seleccionar al menos un archivo o tomar una foto",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Preparar FormData para el webhook de n8n
      const formData = new FormData();
      
      // Agregar archivos con nombres generados
      allFiles.forEach(file => {
        const newFileName = generateFileName(file.name);
        formData.append('files', file, newFileName);
      });
      
      // Agregar metadata
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
      
      // Enviar al webhook de n8n
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
      } else {
        throw new Error(`Error del servidor: ${response.status}`);
      }
      
      // Limpiar formulario
      setSelectedPlaca('');
      setPlacaSearch('');
      setDocumentTag('');
      setCustomTag('');
      setFiles(null);
      setCapturedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      
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

  const handlePlacaSelect = (placa: string) => {
    setSelectedPlaca(placa);
    setPlacaSearch(placa);
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
          {/* Búsqueda y Selección de Placa */}
          <div className="space-y-2">
            <Label htmlFor="placa-search">Buscar y Seleccionar Placa del Vehículo</Label>
            <Input
              id="placa-search"
              value={placaSearch}
              onChange={(e) => setPlacaSearch(e.target.value)}
              placeholder="Escriba para buscar una placa..."
              className="mb-2 border-2 border-gray-400 focus:border-blue-500"
            />
            {loadingVehiculos ? (
              <div className="text-sm text-gray-500">Cargando vehículos...</div>
            ) : (
              <Select value={selectedPlaca} onValueChange={handlePlacaSelect}>
                <SelectTrigger className="border-2 border-gray-400 focus:border-blue-500">
                  <SelectValue placeholder="Seleccione una placa..." />
                </SelectTrigger>
                <SelectContent>
                  {filteredVehiculos.length > 0 ? (
                    filteredVehiculos.map(vehiculo => (
                      <SelectItem key={vehiculo.id} value={vehiculo.placa}>
                        {vehiculo.placa} {vehiculo.marca && vehiculo.modelo && `- ${vehiculo.marca} ${vehiculo.modelo}`}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      No se encontraron placas que coincidan
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Tipo de Documento */}
          {selectedPlaca && (
            <div className="space-y-2">
              <Label>Tipo de Documento / Etiqueta</Label>
              {loadingTipos ? (
                <div className="text-sm text-gray-500">Cargando tipos de documentos...</div>
              ) : (
                <Select value={documentTag} onValueChange={setDocumentTag}>
                  <SelectTrigger className="border-2 border-gray-400 focus:border-blue-500">
                    <SelectValue placeholder="Seleccione el tipo de documento..." />
                  </SelectTrigger>
                  <SelectContent>
                    {allTiposDocumentos.map(tipo => (
                      <SelectItem key={tipo.id} value={tipo.codigo}>{tipo.nombre}</SelectItem>
                    ))}
                    <SelectItem value="custom">Otro / Etiqueta Personalizada</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Etiqueta Personalizada */}
          {documentTag === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="custom-tag">Etiqueta Personalizada</Label>
              <Input
                id="custom-tag"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="Ingrese la etiqueta personalizada..."
                className="border-2 border-gray-400 focus:border-blue-500"
              />
            </div>
          )}

          {/* Carga de Archivos y Cámara */}
          <div className="space-y-4">
            <Label>Adjuntar Documentos</Label>
            
            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 border-2 border-gray-400 hover:border-gray-600"
              >
                <FileText className="h-4 w-4 mr-2" />
                Seleccionar Archivos
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={openCamera}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 border-2 border-yellow-500 text-gray-700"
              >
                <Camera className="h-4 w-4 mr-2 text-gray-700" />
                <span className="text-gray-700">Tomar Foto</span>
              </Button>
            </div>

            {/* Input de archivos oculto */}
            <Input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Input de cámara oculto */}
            <Input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCameraCapture}
              className="hidden"
            />

            {/* Zona de información */}
            <div className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center">
              <div className="flex justify-center space-x-4 mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">
                Seleccione archivos desde su dispositivo o tome fotos con la cámara
                <br />
                <span className="text-xs">JPG, PNG, PDF - Múltiples archivos permitidos</span>
              </p>
            </div>
            
            {/* Lista de archivos seleccionados y fotos capturadas */}
            {(files?.length || capturedFiles.length > 0) && (
              <Alert className="border-2 border-green-400">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-medium">
                      {(files?.length || 0) + capturedFiles.length} archivo(s) seleccionado(s):
                    </div>
                    
                    {/* Archivos seleccionados */}
                    {files && Array.from(files).map((file, index) => (
                      <div key={`file-${index}`} className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-300">
                        <span>📄 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index, false)}
                          className="text-red-500 hover:text-red-700 p-1 h-auto"
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                    
                    {/* Fotos capturadas */}
                    {capturedFiles.map((file, index) => (
                      <div key={`capture-${index}`} className="flex items-center justify-between text-sm text-gray-600 bg-yellow-50 p-2 rounded border border-yellow-300">
                        <span>📷 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index, true)}
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

          {/* Botón de Envío */}
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
