-- Ejemplos de uso para la tabla inscripciones con BLOB
-- Base de datos PostgreSQL

-- ========================================
-- CONSULTAS DE EJEMPLO
-- ========================================

-- 1. Obtener todas las inscripciones activas sin los BLOB (más rápido)
SELECT * FROM academico.inscripciones_info 
WHERE estado = 'A' 
ORDER BY created_at DESC;

-- 2. Obtener inscripciones con información de archivos
SELECT 
    id,
    nombre_estudiante,
    grado,
    tiene_fotografia,
    tiene_carnet_vacunas,
    tiene_registro_civil,
    tiene_eps,
    tiene_doc_acudiente,
    tiene_boletines,
    fotografia_size,
    carnet_vacunas_size
FROM academico.inscripciones_info
WHERE estado = 'A';

-- 3. Obtener una inscripción específica con todos los BLOB
SELECT 
    id,
    nombre_estudiante,
    fotografia_blob,
    fotografia_nombre,
    fotografia_tipo,
    carnet_vacunas_blob,
    carnet_vacunas_nombre,
    carnet_vacunas_tipo
FROM academico.inscripciones 
WHERE id = 1 AND estado = 'A';

-- 4. Obtener solo un tipo de archivo específico
SELECT 
    id,
    nombre_estudiante,
    fotografia_blob,
    fotografia_nombre,
    fotografia_tipo
FROM academico.inscripciones 
WHERE id = 1 
  AND fotografia_blob IS NOT NULL;

-- 5. Estadísticas de archivos por tipo
SELECT 
    COUNT(*) as total_inscripciones,
    COUNT(fotografia_blob) as con_fotografia,
    COUNT(carnet_vacunas_blob) as con_carnet_vacunas,
    COUNT(registro_civil_blob) as con_registro_civil,
    COUNT(eps_blob) as con_eps,
    COUNT(doc_acudiente_blob) as con_doc_acudiente,
    COUNT(CASE WHEN boletines_blob IS NOT NULL THEN 1 END) as con_boletines
FROM academico.inscripciones
WHERE estado = 'A';

-- 6. Tamaño total de archivos por inscripción
SELECT 
    id,
    nombre_estudiante,
    get_blob_size(id) as tamaño_total_bytes,
    ROUND(get_blob_size(id) / 1024.0 / 1024.0, 2) as tamaño_total_mb
FROM academico.inscripciones
WHERE estado = 'A'
ORDER BY get_blob_size(id) DESC;

-- 7. Inscripciones por grado con archivos
SELECT 
    grado,
    COUNT(*) as total,
    COUNT(fotografia_blob) as con_foto,
    AVG(LENGTH(fotografia_blob)) as promedio_tamaño_foto
FROM academico.inscripciones
WHERE estado = 'A'
GROUP BY grado
ORDER BY grado;

-- ========================================
-- OPERACIONES DE MANTENIMIENTO
-- ========================================

-- 8. Limpiar archivos BLOB de inscripciones inactivas (cuidado!)
-- UPDATE academico.inscripciones 
-- SET 
--     fotografia_blob = NULL,
--     fotografia_nombre = NULL,
--     fotografia_tipo = NULL,
--     carnet_vacunas_blob = NULL,
--     carnet_vacunas_nombre = NULL,
--     carnet_vacunas_tipo = NULL
-- WHERE estado = 'I' 
--   AND updated_at < CURRENT_DATE - INTERVAL '1 year';

-- 9. Verificar integridad de datos BLOB
SELECT 
    id,
    nombre_estudiante,
    CASE 
        WHEN fotografia_blob IS NOT NULL AND fotografia_nombre IS NULL THEN 'Foto sin nombre'
        WHEN fotografia_blob IS NULL AND fotografia_nombre IS NOT NULL THEN 'Nombre sin foto'
        ELSE 'OK'
    END as estado_fotografia,
    CASE 
        WHEN carnet_vacunas_blob IS NOT NULL AND carnet_vacunas_nombre IS NULL THEN 'Carnet sin nombre'
        WHEN carnet_vacunas_blob IS NULL AND carnet_vacunas_nombre IS NOT NULL THEN 'Nombre sin carnet'
        ELSE 'OK'
    END as estado_carnet
FROM academico.inscripciones
WHERE estado = 'A';

-- 10. Buscar archivos duplicados por nombre
SELECT 
    fotografia_nombre,
    COUNT(*) as duplicados
FROM academico.inscripciones
WHERE fotografia_nombre IS NOT NULL
GROUP BY fotografia_nombre
HAVING COUNT(*) > 1;

-- ========================================
-- CONSULTAS PARA LA API
-- ========================================

-- 11. Query para /api/registros/publicos (usado en el código)
SELECT 
    id,
    nombre_estudiante,
    grado,
    sub_grado,
    fecha_nacimiento,
    nombre_acudiente,
    contacto1,
    estado,
    fotografia_blob, fotografia_nombre, fotografia_tipo,
    carnet_vacunas_blob, carnet_vacunas_nombre, carnet_vacunas_tipo,
    registro_civil_blob, registro_civil_nombre, registro_civil_tipo,
    eps_blob, eps_nombre, eps_tipo,
    boletines_blob, boletines_info,
    doc_acudiente_blob, doc_acudiente_nombre, doc_acudiente_tipo,
    created_at
FROM academico.inscripciones 
WHERE estado = 'A'
ORDER BY created_at DESC
LIMIT 50;

-- 12. Query para /api/archivo/:id/:tipo (ejemplo para fotografía)
SELECT 
    fotografia_blob, 
    fotografia_nombre, 
    fotografia_tipo
FROM academico.inscripciones 
WHERE id = $1 AND estado = 'A';

-- ========================================
-- FUNCIONES ÚTILES ADICIONALES
-- ========================================

-- 13. Función para convertir BLOB a base64 (si se necesita en la DB)
CREATE OR REPLACE FUNCTION blob_to_base64(blob_data BYTEA)
RETURNS TEXT AS $$
BEGIN
    IF blob_data IS NULL THEN
        RETURN NULL;
    END IF;
    RETURN encode(blob_data, 'base64');
END;
$$ LANGUAGE plpgsql;

-- 14. Función para obtener información resumida de archivos
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

-- Ejemplo de uso de la función
-- SELECT get_files_summary(1);

-- ========================================
-- BACKUP Y RESTAURACIÓN
-- ========================================

-- 15. Para hacer backup sin los BLOB (más rápido)
-- pg_dump -d tu_base_de_datos -t academico.inscripciones_info --data-only > backup_sin_blob.sql

-- 16. Para hacer backup completo con BLOB
-- pg_dump -d tu_base_de_datos -t academico.inscripciones > backup_completo.sql

-- ========================================
-- MONITOREO Y PERFORMANCE
-- ========================================

-- 17. Tamaño total de la tabla
SELECT 
    pg_size_pretty(pg_total_relation_size('academico.inscripciones')) as tamaño_total,
    pg_size_pretty(pg_relation_size('academico.inscripciones')) as tamaño_tabla,
    pg_size_pretty(pg_indexes_size('academico.inscripciones')) as tamaño_indices;

-- 18. Estadísticas de uso de BLOB
SELECT 
    'fotografia' as tipo_archivo,
    COUNT(*) as total_archivos,
    AVG(LENGTH(fotografia_blob)) as tamaño_promedio,
    MIN(LENGTH(fotografia_blob)) as tamaño_minimo,
    MAX(LENGTH(fotografia_blob)) as tamaño_maximo,
    SUM(LENGTH(fotografia_blob)) as tamaño_total
FROM academico.inscripciones 
WHERE fotografia_blob IS NOT NULL

UNION ALL

SELECT 
    'carnet_vacunas' as tipo_archivo,
    COUNT(*) as total_archivos,
    AVG(LENGTH(carnet_vacunas_blob)) as tamaño_promedio,
    MIN(LENGTH(carnet_vacunas_blob)) as tamaño_minimo,
    MAX(LENGTH(carnet_vacunas_blob)) as tamaño_maximo,
    SUM(LENGTH(carnet_vacunas_blob)) as tamaño_total
FROM academico.inscripciones 
WHERE carnet_vacunas_blob IS NOT NULL;

-- ========================================
-- LIMPIEZA Y OPTIMIZACIÓN
-- ========================================

-- 19. Reindexar tabla (ejecutar periódicamente)
-- REINDEX TABLE academico.inscripciones;

-- 20. Analizar estadísticas (ejecutar después de cambios grandes)
-- ANALYZE academico.inscripciones;

-- 21. Vacuum para recuperar espacio (ejecutar periódicamente)
-- VACUUM ANALYZE academico.inscripciones;