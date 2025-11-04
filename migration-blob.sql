-- Migración para convertir el sistema a BLOB
-- Ejecutar este script en la base de datos PostgreSQL

-- Agregar nuevas columnas BLOB para cada tipo de archivo
ALTER TABLE academico.inscripciones 
ADD COLUMN IF NOT EXISTS fotografia_blob BYTEA,
ADD COLUMN IF NOT EXISTS fotografia_nombre VARCHAR(255),
ADD COLUMN IF NOT EXISTS fotografia_tipo VARCHAR(100),

ADD COLUMN IF NOT EXISTS carnet_vacunas_blob BYTEA,
ADD COLUMN IF NOT EXISTS carnet_vacunas_nombre VARCHAR(255),
ADD COLUMN IF NOT EXISTS carnet_vacunas_tipo VARCHAR(100),

ADD COLUMN IF NOT EXISTS registro_civil_blob BYTEA,
ADD COLUMN IF NOT EXISTS registro_civil_nombre VARCHAR(255),
ADD COLUMN IF NOT EXISTS registro_civil_tipo VARCHAR(100),

ADD COLUMN IF NOT EXISTS eps_blob BYTEA,
ADD COLUMN IF NOT EXISTS eps_nombre VARCHAR(255),
ADD COLUMN IF NOT EXISTS eps_tipo VARCHAR(100),

ADD COLUMN IF NOT EXISTS doc_acudiente_blob BYTEA,
ADD COLUMN IF NOT EXISTS doc_acudiente_nombre VARCHAR(255),
ADD COLUMN IF NOT EXISTS doc_acudiente_tipo VARCHAR(100),

ADD COLUMN IF NOT EXISTS boletines_blob TEXT, -- JSON con array de BLOB en base64
ADD COLUMN IF NOT EXISTS boletines_info TEXT; -- JSON con información de archivos

-- Comentarios para documentar las columnas
COMMENT ON COLUMN academico.inscripciones.fotografia_blob IS 'Archivo de fotografía almacenado como BLOB';
COMMENT ON COLUMN academico.inscripciones.fotografia_nombre IS 'Nombre original del archivo de fotografía';
COMMENT ON COLUMN academico.inscripciones.fotografia_tipo IS 'Tipo MIME del archivo de fotografía';

COMMENT ON COLUMN academico.inscripciones.carnet_vacunas_blob IS 'Archivo de carnet de vacunas almacenado como BLOB';
COMMENT ON COLUMN academico.inscripciones.carnet_vacunas_nombre IS 'Nombre original del archivo de carnet de vacunas';
COMMENT ON COLUMN academico.inscripciones.carnet_vacunas_tipo IS 'Tipo MIME del archivo de carnet de vacunas';

COMMENT ON COLUMN academico.inscripciones.registro_civil_blob IS 'Archivo de registro civil almacenado como BLOB';
COMMENT ON COLUMN academico.inscripciones.registro_civil_nombre IS 'Nombre original del archivo de registro civil';
COMMENT ON COLUMN academico.inscripciones.registro_civil_tipo IS 'Tipo MIME del archivo de registro civil';

COMMENT ON COLUMN academico.inscripciones.eps_blob IS 'Archivo de EPS almacenado como BLOB';
COMMENT ON COLUMN academico.inscripciones.eps_nombre IS 'Nombre original del archivo de EPS';
COMMENT ON COLUMN academico.inscripciones.eps_tipo IS 'Tipo MIME del archivo de EPS';

COMMENT ON COLUMN academico.inscripciones.doc_acudiente_blob IS 'Documento del acudiente almacenado como BLOB';
COMMENT ON COLUMN academico.inscripciones.doc_acudiente_nombre IS 'Nombre original del documento del acudiente';
COMMENT ON COLUMN academico.inscripciones.doc_acudiente_tipo IS 'Tipo MIME del documento del acudiente';

COMMENT ON COLUMN academico.inscripciones.boletines_blob IS 'Array JSON de boletines almacenados como BLOB en base64';
COMMENT ON COLUMN academico.inscripciones.boletines_info IS 'Información JSON de los archivos de boletines';

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_inscripciones_estado_blob ON academico.inscripciones(estado) WHERE estado = 'A';
CREATE INDEX IF NOT EXISTS idx_inscripciones_created_at_blob ON academico.inscripciones(created_at DESC);

-- Verificar la estructura actualizada
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'academico' 
  AND table_name = 'inscripciones'
  AND column_name LIKE '%blob%' OR column_name LIKE '%nombre%' OR column_name LIKE '%tipo%'
ORDER BY ordinal_position;