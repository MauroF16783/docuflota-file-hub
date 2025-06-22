
-- Crear tabla de vehículos
CREATE TABLE public.vehiculos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  placa VARCHAR(10) NOT NULL UNIQUE,
  marca VARCHAR(50),
  modelo VARCHAR(50),
  año INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de conductores
CREATE TABLE public.conductores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cedula VARCHAR(20) NOT NULL UNIQUE,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear enum para tipos de documentos
CREATE TYPE public.tipo_documento AS ENUM (
  'mantenimiento',
  'revision_tecnomecanica', 
  'soat',
  'tarjeta_propiedad',
  'seguridad_social',
  'pase',
  'cedula',
  'cursos',
  'examenes_medicos'
);

-- Crear enum para categoría de documento (vehículo o conductor)
CREATE TYPE public.categoria_documento AS ENUM ('vehiculo', 'conductor');

-- Crear tabla de tipos de documentos
CREATE TABLE public.tipos_documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  categoria categoria_documento NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar tipos de documentos para vehículos
INSERT INTO public.tipos_documentos (codigo, nombre, categoria) VALUES
('Mant', 'Mantenimiento', 'vehiculo'),
('TMC', 'Revisión Tecnomecánica', 'vehiculo'),
('SOAT', 'SOAT', 'vehiculo'),
('TP', 'Tarjeta de Propiedad', 'vehiculo');

-- Insertar tipos de documentos para conductores
INSERT INTO public.tipos_documentos (codigo, nombre, categoria) VALUES
('SS', 'Seguridad Social', 'conductor'),
('Pase', 'Pase', 'conductor'),
('Cedula', 'Cédula', 'conductor'),
('Cursos', 'Cursos', 'conductor'),
('EM', 'Exámenes Médicos', 'conductor');

-- Insertar algunos vehículos de ejemplo
INSERT INTO public.vehiculos (placa, marca, modelo, año) VALUES
('ABC123', 'Toyota', 'Hilux', 2020),
('XYZ789', 'Chevrolet', 'NPR', 2019),
('DEF456', 'Isuzu', 'NLR', 2021),
('GHI789', 'Ford', 'Cargo', 2018),
('JKL012', 'Mercedes', 'Sprinter', 2022);

-- Insertar algunos conductores de ejemplo
INSERT INTO public.conductores (cedula, nombres, apellidos, telefono) VALUES
('12345678', 'Juan Carlos', 'González López', '3001234567'),
('87654321', 'María Elena', 'Rodríguez Pérez', '3009876543'),
('11223344', 'Pedro José', 'Martínez Silva', '3001122334'),
('55667788', 'Ana Lucía', 'Torres Vargas', '3005566778'),
('99887766', 'Carlos Eduardo', 'Morales Castro', '3009988776');

-- Habilitar RLS en todas las tablas
ALTER TABLE public.vehiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conductores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipos_documentos ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS (por ahora permisivas para testing)
CREATE POLICY "Allow public read access on vehiculos" ON public.vehiculos FOR SELECT USING (true);
CREATE POLICY "Allow public read access on conductores" ON public.conductores FOR SELECT USING (true);
CREATE POLICY "Allow public read access on tipos_documentos" ON public.tipos_documentos FOR SELECT USING (true);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_vehiculos_placa ON public.vehiculos(placa);
CREATE INDEX idx_conductores_cedula ON public.conductores(cedula);
CREATE INDEX idx_tipos_documentos_categoria ON public.tipos_documentos(categoria);
