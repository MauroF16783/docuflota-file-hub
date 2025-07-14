
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVehiculos } from '@/hooks/useVehiculos';

interface VehicleSelectorProps {
  selectedPlaca: string;
  onPlacaChange: (placa: string) => void;
}

export const VehicleSelector = ({ selectedPlaca, onPlacaChange }: VehicleSelectorProps) => {
  const { vehiculos, loading: loadingVehiculos } = useVehiculos();

  return (
    <div className="space-y-2">
      <Label>Seleccionar Placa del Vehículo</Label>
      {loadingVehiculos ? (
        <div className="text-sm text-white">Cargando vehículos...</div>
      ) : (
        <Select value={selectedPlaca} onValueChange={onPlacaChange}>
          <SelectTrigger className="border-2 border-gray-400 focus:border-blue-500">
            <SelectValue placeholder="Seleccione una placa..." />
          </SelectTrigger>
          <SelectContent>
            {vehiculos.length > 0 ? (
              vehiculos.map(vehiculo => (
                <SelectItem key={vehiculo.id} value={vehiculo.placa}>
                  {vehiculo.placa} {vehiculo.marca && vehiculo.modelo && `- ${vehiculo.marca} ${vehiculo.modelo}`}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="" disabled>
                No hay vehículos disponibles
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
