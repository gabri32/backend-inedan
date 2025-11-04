-- INSTALACIÓN COMPLETA DEL SISTEMA BLOB PARA INSCRIPCIONES
-- Ejecutar este archivo completo en PostgreSQL
-- Base de datos: Backend INEDAN

-- ========================================
-- 1. CREAR ESQUEMA Y TABLA PRINCIPAL
-- ========================================

-- Crear esquema si no existe
CREATE SCHEMA IF NOT EXISTS academico;

-- Eliminar tabla si existe (¡CUIDADO! Esto borra todos los datos)
-- DROP TABLE IF EXISTS academico.inscripciones CASCADE;

-- Crear tabla completa con todas las columnas BLOB
CREATE TABLE IF NOT EXISTS academico.inscripciones (
    -- Campos de identificación
    id SERIAL PRIMARY KEY,
    
    -- Información del estudiante
    grado INTEGER NOT NULL,
    sub_grado VARCHAR(50),
    nombre_estudiante VARCHAR(255) NOT NULL,
    cedula_estudiante VARCHAR(20) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sisben VARCHAR(50),
    
    -- Información del acudiente
    nombre_acudiente VARCHAR(255) NOT NULL,
    cedula_acudiente VARCHAR(20) NOT NULL,
    contacto1 VARCHAR(20) NOT NULL,
    contacto2 VARCHAR(20),
    
    -- Estado y control
    estado CHAR(1) DEFAULT 'I' CHECK (estado IN ('A', 'I', 'P')),
    
    -- ARCHIVOS COMO BLOB - Fotografía
    fotografia_blob BYTEA,
    fotografia_nombre VARCHAR(255),
    fotografia_tipo VARCHAR(100),
    
    -- ARCHIVOS COMO BLOB - Carnet de Vacunas
    carnet_vacunas_blob BYTEA,
    carnet_vacunas_nombre VARCHAR(255),
    carnet_vacunas_tipo VARCHAR(100),
    
    -- ARCHIVOS COMO BLOB - Registro Civil
    registro_civil_blob BYTEA,
    registro_civil_nombre VARCHAR(255),
    registro_civil_tipo VARCHAR(100),
    
    -- ARCHIVOS COMO BLOB - EPS
    eps_blob BYTEA,
    eps_nombre VARCHAR(255),
    eps_tipo VARCHAR(100),
    
    -- ARCHIVOS COMO BLOB - Documento del Acudiente
    doc_acudiente_blob BYTEA,
    doc_acudiente_nombre VARCHAR(255),
    doc_acudiente_tipo VARCHAR(100),
    
    -- ARCHIVOS COMO BLOB - Boletines (múltiples archivos en JSON)
    boletines_blob TEXT,
    boletines_info TEXT,
    
    -- Campos de auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Campos adicionales
    observaciones TEXT,
    fecha_inscripcion DATE DEFAULT CURRENT_DATE,
    
    -- Campos legacy para compatibilidad (opcional)
    registro_civil VARCHAR(500),
    eps VARCHAR(500),
    carnet_vacunas VARCHAR(500),
    fotografia VARCHAR(500),
    boletines TEXT,
    doc_acudiente VARCHAR(500)
);

-- ========================================
-- 2. AGREGAR CONSTRAINT ÚNICO PARA CÉDULA
-- ========================================

-- Eliminar constraint si existe
ALTER TABLE academico.inscripciones DROP CONSTRAINT IF EXISTS uk_cedula_estudiante;

-- Agregar constraint único para cédula de estudiante
ALTER TABLE academico.inscripciones 
ADD CONSTRAINT uk_cedula_estudiante UNIQUE (cedula_estudiante);

-- ========================================
-- 3. CREAR ÍNDICES PARA PERFORMANCE
-- ========================================

-- Índices básicos
CREATE INDEX IF NOT EXISTS idx_inscripciones_cedula_estudiante ON academico.inscripciones(cedula_estudiante);
CREATE INDEX IF NOT EXISTS idx_inscripciones_estado ON academico.inscripciones(estado);
CREATE INDEX IF NOT EXISTS idx_inscripciones_grado ON academico.inscripciones(grado);
CREATE INDEX IF NOT EXISTS idx_inscripciones_created_at ON academico.inscripciones(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inscripciones_fecha_inscripcion ON academico.inscripciones(fecha_inscripcion DESC);
CREATE INDEX IF NOT EXISTS idx_inscripciones_nombre_estudiante ON academico.inscripciones(nombre_estudiante);
CREATE INDEX IF NOT EXISTS idx_inscripciones_cedula_acudiente ON academico.inscripciones(cedula_acudiente);

-- Índices compuestos
CREATE INDEX IF NOT EXISTS idx_inscripciones_estado_grado ON academico.inscripciones(estado, grado);
CREATE INDEX IF NOT EXISTS idx_inscripciones_estado_created_at ON academico.inscripciones(estado, created_at DESC);

-- Índices para archivos BLOB (para saber si existen)
CREATE INDEX IF NOT EXISTS idx_inscripciones_tiene_fotografia ON academico.inscripciones(id) WHERE fotografia_blob IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_inscripciones_tiene_carnet ON academico.inscripciones(id) WHERE carnet_vacunas_blob IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_inscripciones_tiene_registro ON academico.inscripciones(id) WHERE registro_civil_blob IS NOT NULL;

-- ========================================
-- 4. CREAR FUNCIONES ÚTILES
-- ========================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener tamaño total de archivos BLOB
CREATE OR REPLACE FUNCTION get_blob_size(inscripcion_id INTEGER)
RETURNS BIGINT AS $$
DECLARE
    total_size BIGINT := 0;
BEGIN
    SELECT 
        COALESCE(LENGTH(fotografia_blob), 0) +
        COALESCE(LENGTH(carnet_vacunas_blob), 0) +
        COALESCE(LENGTH(registro_civil_blob), 0) +
        COALESCE(LENGTH(eps_blob), 0) +
        COALESCE(LENGTH(doc_acudiente_blob), 0)
    INTO total_size
    FROM academico.inscripciones 
    WHERE id = inscripcion_id;
    
    RETURN COALESCE(total_size, 0);
END;
$$ LANGUAGE plpgsql;

-- Función para convertir BLOB a base64
CREATE OR REPLACE FUNCTION blob_to_base64(blob_data BYTEA)
RETURNS TEXT AS $$
BEGIN
    IF blob_data IS NULL THEN
        RETURN NULL;
    END IF;
    RETURN encode(blob_data, 'base64');
END;
$$ LANGUAGE plpgsql;

-- Función para obtener resumen de archivos en JSON
CREATE OR REPLACE FUNCTION get_files_summary(inscripcion_id INTEGER)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'fotografia', CASE WHEN fotografia_blob IS NOT NULL THEN 
            json_build_object(
                'nombre', fotografia_nombre,
                'tipo', fotografia_tipo,
                'tamaño', LENGTH(fotografia_blob)
            ) ELSE NULL END,
        'carnet_vacunas', CASE WHEN carnet_vacunas_blob IS NOT NULL THEN 
            json_build_object(
                'nombre', carnet_vacunas_nombre,
                'tipo', carnet_vacunas_tipo,
                'tamaño', LENGTH(carnet_vacunas_blob)
            ) ELSE NULL END,
        'registro_civil', CASE WHEN registro_civil_blob IS NOT NULL THEN 
            json_build_object(
                'nombre', registro_civil_nombre,
                'tipo', registro_civil_tipo,
                'tamaño', LENGTH(registro_civil_blob)
            ) ELSE NULL END,
        'eps', CASE WHEN eps_blob IS NOT NULL THEN 
            json_build_object(
                'nombre', eps_nombre,
                'tipo', eps_tipo,
                'tamaño', LENGTH(eps_blob)
            ) ELSE NULL END,
        'doc_acudiente', CASE WHEN doc_acudiente_blob IS NOT NULL THEN 
            json_build_object(
                'nombre', doc_acudiente_nombre,
                'tipo', doc_acudiente_tipo,
                'tamaño', LENGTH(doc_acudiente_blob)
            ) ELSE NULL END
    ) INTO result
    FROM academico.inscripciones
    WHERE id = inscripcion_id;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 5. CREAR TRIGGERS
-- ========================================

-- Trigger para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS update_inscripciones_updated_at ON academico.inscripciones;
CREATE TRIGGER update_inscripciones_updated_at 
    BEFORE UPDATE ON academico.inscripciones 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 6. CREAR VISTA OPTIMIZADA (SIN BLOB)
-- ========================================

CREATE OR REPLACE VIEW academico.inscripciones_info AS
SELECT 
    id,
    grado,
    sub_grado,
    nombre_estudiante,
    cedula_estudiante,
    fecha_nacimiento,
    nombre_acudiente,
    cedula_acudiente,
    contacto1,
    contacto2,
    estado,
    sisben,
    -- Información de archivos sin el BLOB
    CASE WHEN fotografia_blob IS NOT NULL THEN fotografia_nombre ELSE NULL END as tiene_fotografia,
    CASE WHEN carnet_vacunas_blob IS NOT NULL THEN carnet_vacunas_nombre ELSE NULL END as tiene_carnet_vacunas,
    CASE WHEN registro_civil_blob IS NOT NULL THEN registro_civil_nombre ELSE NULL END as tiene_registro_civil,
    CASE WHEN eps_blob IS NOT NULL THEN eps_nombre ELSE NULL END as tiene_eps,
    CASE WHEN doc_acudiente_blob IS NOT NULL THEN doc_acudiente_nombre ELSE NULL END as tiene_doc_acudiente,
    CASE WHEN boletines_blob IS NOT NULL THEN 'Sí' ELSE 'No' END as tiene_boletines,
    -- Tamaños de archivos
    LENGTH(fotografia_blob) as fotografia_size,
    LENGTH(carnet_vacunas_blob) as carnet_vacunas_size,
    LENGTH(registro_civil_blob) as registro_civil_size,
    LENGTH(eps_blob) as eps_size,
    LENGTH(doc_acudiente_blob) as doc_acudiente_size,
    -- Auditoría
    created_at,
    updated_at,
    fecha_inscripcion,
    observaciones,
    created_by,
    updated_by
FROM academico.inscripciones;

-- ========================================
-- 7. AGREGAR COMENTARIOS DOCUMENTACIÓN
-- ========================================

COMMENT ON TABLE academico.inscripciones IS 'Tabla de inscripciones con archivos almacenados como BLOB - Sistema Backend INEDAN';
COMMENT ON COLUMN academico.inscripciones.id IS 'Identificador único de la inscripción';
COMMENT ON COLUMN academico.inscripciones.estado IS 'Estado: A=Activo, I=Inactivo, P=Pendiente';

-- Comentarios para archivos BLOB
COMMENT ON COLUMN academico.inscripciones.fotografia_blob IS 'Fotografía del estudiante (BYTEA)';
COMMENT ON COLUMN academico.inscripciones.fotografia_nombre IS 'Nombre original del archivo de fotografía';
COMMENT ON COLUMN academico.inscripciones.fotografia_tipo IS 'Tipo MIME de la fotografía';

COMMENT ON COLUMN academico.inscripciones.carnet_vacunas_blob IS 'Carnet de vacunas (BYTEA)';
COMMENT ON COLUMN academico.inscripciones.carnet_vacunas_nombre IS 'Nombre original del carnet de vacunas';
COMMENT ON COLUMN academico.inscripciones.carnet_vacunas_tipo IS 'Tipo MIME del carnet de vacunas';

COMMENT ON COLUMN academico.inscripciones.registro_civil_blob IS 'Registro civil (BYTEA)';
COMMENT ON COLUMN academico.inscripciones.registro_civil_nombre IS 'Nombre original del registro civil';
COMMENT ON COLUMN academico.inscripciones.registro_civil_tipo IS 'Tipo MIME del registro civil';

COMMENT ON COLUMN academico.inscripciones.eps_blob IS 'Documento de EPS (BYTEA)';
COMMENT ON COLUMN academico.inscripciones.eps_nombre IS 'Nombre original del documento de EPS';
COMMENT ON COLUMN academico.inscripciones.eps_tipo IS 'Tipo MIME del documento de EPS';

COMMENT ON COLUMN academico.inscripciones.doc_acudiente_blob IS 'Documento del acudiente (BYTEA)';
COMMENT ON COLUMN academico.inscripciones.doc_acudiente_nombre IS 'Nombre original del documento del acudiente';
COMMENT ON COLUMN academico.inscripciones.doc_acudiente_tipo IS 'Tipo MIME del documento del acudiente';

COMMENT ON COLUMN academico.inscripciones.boletines_blob IS 'Array JSON de boletines en base64';
COMMENT ON COLUMN academico.inscripciones.boletines_info IS 'Información JSON de los boletines';

-- ========================================
-- 8. INSERTAR DATOS DE EJEMPLO
-- ========================================

INSERT INTO academico.inscripciones (
    grado, nombre_estudiante, cedula_estudiante, fecha_nacimiento,
    nombre_acudiente, cedula_acudiente, contacto1, estado
) VALUES 
(1, 'Juan Pérez Ejemplo', '1000000001', '2015-03-15', 'María Pérez', '2000000001', '3001234567', 'A'),
(2, 'Ana García Ejemplo', '1000000002', '2014-07-22', 'Carlos García', '2000000002', '3001234568', 'A'),
(3, 'Luis Rodríguez Ejemplo', '1000000003', '2013-11-08', 'Elena Rodríguez', '2000000003', '3001234569', 'P')
ON CONFLICT (cedula_estudiante) DO NOTHING;

-- ========================================
-- 9. VERIFICACIONES FINALES
-- ========================================

-- Verificar estructura de la tabla
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'academico' 
  AND table_name = 'inscripciones'
ORDER BY ordinal_position;

-- Verificar índices creados
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'academico' 
  AND tablename = 'inscripciones';

-- Verificar funciones creadas
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name LIKE '%blob%' OR routine_name LIKE '%inscripciones%';

-- Verificar triggers
SELECT 
    trigger_name,
    event_manipulation,
    action_timing
FROM information_schema.triggers 
WHERE event_object_schema = 'academico' 
  AND event_object_table = 'inscripciones';

-- Mostrar tamaño de la tabla
SELECT 
    pg_size_pretty(pg_total_relation_size('academico.inscripciones')) as tamaño_total;

-- Contar registros
SELECT COUNT(*) as total_inscripciones FROM academico.inscripciones;

-- ========================================
-- 10. MENSAJE DE CONFIRMACIÓN
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ INSTALACIÓN COMPLETA FINALIZADA';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Tabla: academico.inscripciones creada';
    RAISE NOTICE 'Índices: Creados para optimización';
    RAISE NOTICE 'Funciones: Creadas para manejo BLOB';
    RAISE NOTICE 'Triggers: Configurados para auditoría';
    RAISE NOTICE 'Vista: academico.inscripciones_info disponible';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Sistema BLOB listo para usar con Backend INEDAN';
    RAISE NOTICE 'Ejecutar: npm start en el proyecto Node.js';
    RAISE NOTICE 'Probar en: http://localhost:3525/test-blob.html';
    RAISE NOTICE '========================================';
END $$;