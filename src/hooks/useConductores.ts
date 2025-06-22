
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Conductor {
  id: string;
  cedula: string;
  nombres: string;
  apellidos: string;
  telefono?: string;
  email?: string;
}

export const useConductores = () => {
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConductores = async () => {
      try {
        const { data, error } = await supabase
          .from('conductores')
          .select('id, cedula, nombres, apellidos, telefono, email')
          .order('nombres');

        if (error) throw error;
        setConductores(data || []);
      } catch (err) {
        console.error('Error fetching conductores:', err);
        setError('Error al cargar conductores');
      } finally {
        setLoading(false);
      }
    };

    fetchConductores();
  }, []);

  return { conductores, loading, error };
};
