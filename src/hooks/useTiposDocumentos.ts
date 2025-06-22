
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TipoDocumento {
  id: string;
  codigo: string;
  nombre: string;
  categoria: 'vehiculo' | 'conductor';
  activo: boolean;
}

export const useTiposDocumentos = (categoria?: 'vehiculo' | 'conductor') => {
  const [tiposDocumentos, setTiposDocumentos] = useState<TipoDocumento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTiposDocumentos = async () => {
      try {
        let query = supabase
          .from('tipos_documentos')
          .select('id, codigo, nombre, categoria, activo')
          .eq('activo', true)
          .order('nombre');

        if (categoria) {
          query = query.eq('categoria', categoria);
        }

        const { data, error } = await query;

        if (error) throw error;
        setTiposDocumentos(data || []);
      } catch (err) {
        console.error('Error fetching tipos documentos:', err);
        setError('Error al cargar tipos de documentos');
      } finally {
        setLoading(false);
      }
    };

    fetchTiposDocumentos();
  }, [categoria]);

  return { tiposDocumentos, loading, error };
};
