
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Vehiculo {
  id: string;
  placa: string;
  marca?: string;
  modelo?: string;
  año?: number;
}

export const useVehiculos = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const { data, error } = await supabase
          .from('vehiculos')
          .select('id, placa, marca, modelo, año')
          .order('placa');

        if (error) throw error;
        setVehiculos(data || []);
      } catch (err) {
        console.error('Error fetching vehiculos:', err);
        setError('Error al cargar vehículos');
      } finally {
        setLoading(false);
      }
    };

    fetchVehiculos();
  }, []);

  return { vehiculos, loading, error };
};
