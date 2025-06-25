import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useVehiculos } from '@/hooks/useVehiculos';
import { useConductores } from '@/hooks/useConductores';
import { useTiposDocumentos } from '@/hooks/useTiposDocumentos';

const DocumentUploadForm = () => {
  const { toast } = useToast();
  const [selectionType, setSelectionType] = useState<'placa' | 'cedula' | ''>('');
  const [selectedPlaca, setSelectedPlaca] = useState('');
  const [selectedCedula, setSelectedCedula] = useState('');
  const [documentTag, setDocumentTag] = useState('');
  const [customTag, setCustomTag] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Hooks para cargar datos de Supabase
  const { vehiculos, loading: loadingVehiculos } = useVehiculos();
  const { conductores, loading: loadingConductores } = useConductores();
  const { tiposDocumentos, loading: loadingTipos } = useTiposDocumentos(
    selectionType === 'placa' ? 'vehiculo' : selectionType === 'cedula' ? 'conductor' : undefined
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
    const identifier = selectionType === 'placa' ? selectedPlaca : selectedCedula;
    
    return `${tag}-${identifier}-${dateStr}${extension}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!selectionType) {
      toast({
        title: "Error de validación",
        description: "Debe seleccionar una placa o una cédula",
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
      if (selectionType === 'placa') {
        formData.append('selectedPlate', selectedPlaca);
      } else {
        formData.append('selectedCedula', selectedCedula);
      }
      
      formData.append('documentTag', documentTag === 'custom' ? customTag : documentTag);
      formData.append('submissionDate', new Date().toLocaleDateString('es-ES'));
      
      console.log('Enviando documentos a n8n webhook:', N8N_WEBHOOK_URL);
      console.log('Datos a enviar:', {
        fileCount: files.length,
        selectedIdentifier: selectionType === 'placa' ? selectedPlaca : selectedCedula,
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
      setSelectionType('');
      setSelectedPlaca('');
      setSelectedCedula('');
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
          {/* Selección de Tipo */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Seleccione una opción:</Label>
            <RadioGroup
              value={selectionType}
              onValueChange={(value: 'placa' | 'cedula') => {
                setSelectionType(value);
                setSelectedPlaca('');
                setSelectedCedula('');
                setDocumentTag(''); // Reset document tag when switching types
              }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
                <RadioGroupItem value="placa" id="placa" />
                <Label htmlFor="placa" className="cursor-pointer">Placa del Vehículo</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
                <RadioGroupItem value="cedula" id="cedula" />
                <Label htmlFor="cedula" className="cursor-pointer">Cédula del Conductor</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Selección de Placa */}
          {selectionType === 'placa' && (
            <div className="space-y-2">
              <Label htmlFor="placa-select">Seleccione la Placa del Vehículo</Label>
              {loadingVehiculos ? (
                <div className="text-sm text-gray-500">Cargando vehículos...</div>
              ) : (
                <Select value={selectedPlaca} onValueChange={setSelectedPlaca}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una placa..." />
                  </SelectTrigger>
                  <SelectContent>
                    {vehiculos.map(vehiculo => (
                      <SelectItem key={vehiculo.id} value={vehiculo.placa}>
                        {vehiculo.placa} {vehiculo.marca && vehiculo.modelo && `- ${vehiculo.marca} ${vehiculo.modelo}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Selección de Cédula */}
          {selectionType === 'cedula' && (
            <div className="space-y-2">
              <Label htmlFor="cedula-select">Seleccione la Cédula del Conductor</Label>
              {loadingConductores ? (
                <div className="text-sm text-gray-500">Cargando conductores...</div>
              ) : (
                <Select value={selectedCedula} onValueChange={setSelectedCedula}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una cédula..." />
                  </SelectTrigger>
                  <SelectContent>
                    {conductores.map(conductor => (
                      <SelectItem key={conductor.id} value={conductor.cedula}>
                        {conductor.cedula} - {conductor.nombres} {conductor.apellidos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Tipo de Documento */}
          {selectionType && (
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
                    {tiposDocumentos.map(tipo => (
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
            className="w-full bg-blue-600 hover:bg-blue-700"
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
