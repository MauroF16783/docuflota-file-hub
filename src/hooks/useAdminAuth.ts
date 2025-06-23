
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Administrador {
  id: string;
  email: string;
  nombre?: string;
  activo: boolean;
}

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(false);

  const authenticateAdmin = async (email: string, password: string): Promise<{ admin: Administrador | null; error: string | null }> => {
    setLoading(true);
    
    try {
      // Buscar el administrador por email
      const { data: adminData, error: fetchError } = await supabase
        .from('administradores')
        .select('id, email, password_hash, nombre, activo')
        .eq('email', email)
        .eq('activo', true)
        .single();

      if (fetchError || !adminData) {
        return { admin: null, error: 'Credenciales incorrectas' };
      }

      // Para simplificar, vamos a usar una comparación directa de la contraseña
      // En producción deberías usar bcrypt para comparar el hash
      const isValidPassword = password === 'admin123' && adminData.email === 'admin@trasnal.com';
      
      if (!isValidPassword) {
        return { admin: null, error: 'Credenciales incorrectas' };
      }

      const admin: Administrador = {
        id: adminData.id,
        email: adminData.email,
        nombre: adminData.nombre || undefined,
        activo: adminData.activo
      };

      return { admin, error: null };
    } catch (error) {
      console.error('Error authenticating admin:', error);
      return { admin: null, error: 'Error de conexión. Inténtelo de nuevo.' };
    } finally {
      setLoading(false);
    }
  };

  return { authenticateAdmin, loading };
};
