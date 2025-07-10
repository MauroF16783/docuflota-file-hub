
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTiposDocumentos } from '@/hooks/useTiposDocumentos';

interface DocumentTypeSelectorProps {
  selectedPlaca: string;
  documentTag: string;
  customTag: string;
  onDocumentTagChange: (tag: string) => void;
  onCustomTagChange: (tag: string) => void;
}

export const DocumentTypeSelector = ({
  selectedPlaca,
  documentTag,
  customTag,
  onDocumentTagChange,
  onCustomTagChange
}: DocumentTypeSelectorProps) => {
  const { tiposDocumentos: tiposVehiculo, loading: loadingTiposVehiculo } = useTiposDocumentos('vehiculo');
  const { tiposDocumentos: tiposConductor, loading: loadingTiposConductor } = useTiposDocumentos('conductor');

  const allTiposDocumentos = [...tiposVehiculo, ...tiposConductor];
  const loadingTipos = loadingTiposVehiculo || loadingTiposConductor;

  if (!selectedPlaca) return null;

  return (
    <>
      <div className="space-y-2">
        <Label>Tipo de Documento / Etiqueta</Label>
        {loadingTipos ? (
          <div className="text-sm text-gray-500">Cargando tipos de documentos...</div>
        ) : (
          <Select value={documentTag} onValueChange={onDocumentTagChange}>
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

      {documentTag === 'custom' && (
        <div className="space-y-2">
          <Label htmlFor="custom-tag">Etiqueta Personalizada</Label>
          <Input
            id="custom-tag"
            value={customTag}
            onChange={(e) => onCustomTagChange(e.target.value)}
            placeholder="Ingrese la etiqueta personalizada..."
            className="border-2 border-gray-400 focus:border-blue-500"
          />
        </div>
      )}
    </>
  );
};
