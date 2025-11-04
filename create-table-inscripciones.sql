-- CREATE TABLE completo para inscripciones con sistema BLOB
-- Base de datos PostgreSQL

CREATE SCHEMA IF NOT EXISTS academico;

DROP TABLE IF EXISTS academico.inscripciones CASCADE;

CREATE TABLE academico.inscripciones (
    -- Campos de identificación
    id SERIAL PRIMARY KEY,
    
    -- Información del estudiante
    grado INTEGER NOT NULL,
    sub_grado VARCHAR(50),
    nombre_estudiante VARCHAR(255) NOT NULL,
    cedula_estudiante VARCHAR(20) NOT NULL UNIQUE,
    fecha_nacimiento DATE NOT NULL,
    sisben VARCHAR(50),
    
    -- Información del acudiente
    nombre_acudiente VARCHAR(255) NOT NULL,
    cedula_acudiente VARCHAR(20) NOT NULL,
    contacto1 VARCHAR(20) NOT NULL,
    contacto2 VARCHAR(20),
    
    -- Estado y control
    estado CHAR(1) DEFAULT 'I' CHECK (estado IN ('A', 'I', 'P')), -- A=Activo, I=Inactivo, P=Pendiente
    
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
    boletines_blob TEXT, -- JSON con array de archivos en base64
    boletines_info TEXT, -- JSON con información de los archivos (nombres, tipos, tamaños)
    
    -- Campos de auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Campos adicionales opcionales
    observaciones TEXT,
    fecha_inscripcion DATE DEFAULT CURRENT_DATE,
    
    -- Campos legacy (mantener compatibilidad si existen)
    registro_civil VARCHAR(500), -- Campo anterior (opcional)
    eps VARCHAR(500),            -- Campo anterior (opcional)
    carnet_vacunas VARCHAR(500), -- Campo anterior (opcional)
    fotografia VARCHAR(500),     -- Campo anterior (opcional)
    boletines TEXT,              -- Campo anterior (opcional)
    doc_acudiente VARCHAR(500)   -- Campo anterior (opcional)
);

-- Comentarios para documentar la tabla
COMMENT ON TABLE academico.inscripciones IS 'Tabla de inscripciones con archivos almacenados como BLOB';

-- Comentarios para campos principales
COMMENT ON COLUMN academico.inscripciones.id IS 'Identificador único de la inscripción';
COMMENT ON COLUMN academico.inscripciones.grado IS 'Grado al que se inscribe (1, 2, 3, etc.)';
COMMENT ON COLUMN academico.inscripciones.sub_grado IS 'Sub-grado o sección (A, B, C, etc.)';
COMMENT ON COLUMN academico.inscripciones.estado IS 'Estado: A=Activo, I=Inactivo, P=Pendiente';

-- Comentarios para archivos BLOB
COMMENT ON COLUMN academico.inscripciones.fotografia_blob IS 'Fotografía del estudiante almacenada como BLOB (BYTEA)';
COMMENT ON COLUMN academico.inscripciones.fotografia_nombre IS 'Nombre original del archivo de fotografía';
COMMENT ON COLUMN academico.inscripciones.fotografia_tipo IS 'Tipo MIME de la fotografía (image/jpeg, image/png, etc.)';

COMMENT ON COLUMN academico.inscripciones.carnet_vacunas_blob IS 'Carnet de vacunas almacenado como BLOB (BYTEA)';
COMMENT ON COLUMN academico.inscripciones.carnet_vacunas_nombre IS 'Nombre original del archivo de carnet de vacunas';
COMMENT ON COLUMN academico.inscripciones.carnet_vacunas_tipo IS 'Tipo MIME del carnet de vacunas';

COMMENT ON COLUMN academico.inscripciones.registro_civil_blob IS 'Registro civil almacenado como BLOB (BYTEA)';
COMMENT ON COLUMN academico.inscripciones.registro_civil_nombre IS 'Nombre original del archivo de registro civil';
COMMENT ON COLUMN academico.inscripciones.registro_civil_tipo IS 'Tipo MIME del registro civil';

COMMENT ON COLUMN academico.inscripciones.eps_blob IS 'Documento de EPS almacenado como BLOB (BYTEA)';
COMMENT ON COLUMN academico.inscripciones.eps_nombre IS 'Nombre original del archivo de EPS';
COMMENT ON COLUMN academico.inscripciones.eps_tipo IS 'Tipo MIME del documento de EPS';

COMMENT ON COLUMN academico.inscripciones.doc_acudiente_blob IS 'Documento del acudiente almacenado como BLOB (BYTEA)';
COMMENT ON COLUMN academico.inscripciones.doc_acudiente_nombre IS 'Nombre original del documento del acudiente';
COMMENT ON COLUMN academico.inscripciones.doc_acudiente_tipo IS 'Tipo MIME del documento del acudiente';

COMMENT ON COLUMN academico.inscripciones.boletines_blob IS 'Array JSON de boletines almacenados como BLOB en base64';
COMMENT ON COLUMN academico.inscripciones.boletines_info IS 'Información JSON de los archivos de boletines (nombres, tipos, tamaños)';

-- Índices para mejorar el rendimiento
CREATE INDEX idx_inscripciones_cedula_estudiante ON academico.inscripciones(cedula_estudiante);
CREATE INDEX idx_inscripciones_estado ON academico.inscripciones(estado);
CREATE INDEX idx_inscripciones_grado ON academico.inscripciones(grado);
CREATE INDEX idx_inscripciones_created_at ON academico.inscripciones(created_at DESC);
CREATE INDEX idx_inscripciones_fecha_inscripcion ON academico.inscripciones(fecha_inscripcion DESC);
CREATE INDEX idx_inscripciones_nombre_estudiante ON academico.inscripciones(nombre_estudiante);
CREATE INDEX idx_inscripciones_cedula_acudiente ON academico.inscripciones(cedula_acudiente);

-- Índices compuestos para consultas frecuentes
CREATE INDEX idx_inscripciones_estado_grado ON academico.inscripciones(estado, grado);
CREATE INDEX idx_inscripciones_estado_created_at ON academico.inscripciones(estado, created_at DESC);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_inscripciones_updated_at 
    BEFORE UPDATE ON academico.inscripciones 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Función para obtener el tamaño total de archivos BLOB de una inscripción
CREATE OR REPLACE FUNCTION get_blob_size(inscripcion_id INTEGER)
RETURNS BIGINT AS $$
DECLARE
    total_size BIGINT := 0;
    rec RECORD;
BEGIN
    SELECT 
        COALESCE(LENGTH(fotografia_blob), 0) +
        COALESCE(LENGTH(carnet_vacunas_blob), 0) +
        COALESCE(LENGTH(registro_civil_blob), 0) +
        COALESCE(LENGTH(eps_blob), 0) +
        COALESCE(LENGTH(doc_acudiente_blob), 0) AS size
    INTO total_size
    FROM academico.inscripciones 
    WHERE id = inscripcion_id;
    
    RETURN COALESCE(total_size, 0);
END;
$$ LANGUAGE plpgsql;

-- Vista para consultas frecuentes sin BLOB (mejor rendimiento)
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
    observaciones
FROM academico.inscripciones;

-- Insertar datos de ejemplo (opcional)
INSERT INTO academico.inscripciones (
    grado, nombre_estudiante, cedula_estudiante, fecha_nacimiento,
    nombre_acudiente, cedula_acudiente, contacto1, estado
) VALUES 
(1, 'Juan Pérez', '1234567890', '2015-03-15', 'María Pérez', '0987654321', '3001234567', 'A'),
(2, 'Ana García', '1234567891', '2014-07-22', 'Carlos García', '0987654322', '3001234568', 'A'),
(3, 'Luis Rodríguez', '1234567892', '2013-11-08', 'Elena Rodríguez', '0987654323', '3001234569', 'P');

-- Verificar la estructura creada
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'academico' 
  AND table_name = 'inscripciones'
ORDER BY ordinal_position;

-- Mostrar información de la tabla
SELECT 
    schemaname,
    tablename,
    tableowner,
    tablespace,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE schemaname = 'academico' 
  AND tablename = 'inscripciones';

COMMENT ON TABLE academico.inscripciones IS 'Tabla completa de inscripciones con sistema BLOB - Creada para Backend INEDAN';