
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);

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

  // URL del webhook de n8n actualizada
  const N8N_WEBHOOK_URL = 'https://6b170gzb-5678.use.devtunnels.ms/webhook/555756a4-180f-4561-8dc8-f666cb0f0a11';

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

  const generateFileName = (originalName: string): string => {
    const today = new Date();
    const dateStr = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    const tag = documentTag === 'custom' ? customTag : documentTag;
    
    return `${tag}-${selectedPlaca}-${dateStr}${extension}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
    
    if (!files || files.length === 0) {
      toast({
        title: "Error de validación",
        description: "Debe seleccionar al menos un archivo",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Preparar FormData para el webhook de n8n
      const formData = new FormData();
      
      // Agregar archivos con nombres generados
      Array.from(files).forEach(file => {
        const newFileName = generateFileName(file.name);
        formData.append('files', file, newFileName);
      });
      
      // Agregar metadata
      formData.append('selectedPlate', selectedPlaca);
      formData.append('documentTag', documentTag === 'custom' ? customTag : documentTag);
      formData.append('submissionDate', new Date().toLocaleDateString('es-ES'));
      
      console.log('Enviando documentos a n8n webhook:', N8N_WEBHOOK_URL);
      console.log('Datos a enviar:', {
        fileCount: files.length,
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
          description: `Se enviaron ${files.length} archivo(s) a Google Drive correctamente`,
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
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
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
    setPlacaSearch(placa); // Actualizar el campo de búsqueda con la placa seleccionada
  };

  return (
    <Card className="max-w-2xl mx-auto">
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
              className="mb-2"
            />
            {loadingVehiculos ? (
              <div className="text-sm text-gray-500">Cargando vehículos...</div>
            ) : (
              <Select value={selectedPlaca} onValueChange={handlePlacaSelect}>
                <SelectTrigger>
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
                  <SelectTrigger>
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
              />
            </div>
          )}

          {/* Carga de Archivos */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Adjuntar Documentos</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <Input
                id="file-upload"
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-700 font-medium">
                  Haga clic para seleccionar archivos
                </span>
                <br />
                <span className="text-sm text-gray-500">
                  JPG, PNG, PDF (máximo múltiples archivos)
                </span>
              </Label>
            </div>
            
            {files && files.length > 0 && (
              <Alert className="mt-4">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  {files.length} archivo(s) seleccionado(s):
                  {Array.from(files).map((file, index) => (
                    <div key={index} className="text-sm text-gray-600 mt-1">
                      • {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  ))}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Botón de Envío */}
          <Button 
            type="submit" 
            className="w-full text-white hover:opacity-90"
            style={{ backgroundColor: '#28AE7A' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
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
