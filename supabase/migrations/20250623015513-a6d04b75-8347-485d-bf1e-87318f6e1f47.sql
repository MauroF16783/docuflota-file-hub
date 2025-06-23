
-- Crear tabla para administradores
CREATE TABLE public.administradores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  nombre VARCHAR(100),
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en la tabla de administradores
ALTER TABLE public.administradores ENABLE ROW LEVEL SECURITY;

-- Crear política RLS que permite leer todos los administradores (para autenticación)
CREATE POLICY "Allow public read access on administradores" 
ON public.administradores 
FOR SELECT 
USING (true);

-- Crear índice para mejorar el rendimiento de búsquedas por email
CREATE INDEX idx_administradores_email ON public.administradores(email);

-- Insertar un administrador de ejemplo (puedes cambiar estos datos)
-- La contraseña 'admin123' se hashea usando bcrypt
INSERT INTO public.administradores (email, password_hash, nombre) 
VALUES (
  'admin@trasnal.com', 
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- hash de 'password' 
  'Administrador Principal'
);
