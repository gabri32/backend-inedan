const express = require('express');
const router = express.Router();
const pool = require('../db');
const { getInscritos } = require('../controllers/acadeController');
const upload = require('../config/multer.js');

// Función para procesar archivos como BLOB
const procesarArchivo = (archivo) => {
  if (!archivo) return null;
  
  return {
    buffer: archivo.buffer,
    originalname: archivo.originalname,
    mimetype: archivo.mimetype,
    size: archivo.size
  };
};

// Función para convertir BLOB a base64 para visualización
const blobToBase64 = (buffer, mimetype) => {
  if (!buffer) return null;
  const base64 = buffer.toString('base64');
  return `data:${mimetype};base64,${base64}`;
};



router.post(
  '/registro',
  upload.fields([
    { name: 'carnet_vacunas', maxCount: 1 },
    { name: 'fotografia', maxCount: 1 },
    { name: 'boletines', maxCount: 10 },
    { name: 'registro_civil', maxCount: 1 },
    { name: 'eps', maxCount: 1 },
    { name: 'documento_acudiente', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log('=== INICIO DE REGISTRO CON BLOB ===');
      console.log('Body recibido:', req.body);
      console.log('Archivos recibidos:', Object.keys(req.files || {}));
      
      const {
        grado,
        subGrado,
        nombre_estudiante,
        cedula_estudiante,
        fecha_nacimiento,
        nombre_acudiente,
        cedula_acudiente,
        contacto1,
        contacto2,
        estado,
        sisben
      } = req.body;

      console.log('Procesando archivos como BLOB...');
      
      // Procesar cada archivo como BLOB
      const carnet_vacunas_file = req.files['carnet_vacunas']?.[0];
      const fotografia_file = req.files['fotografia']?.[0];
      const registro_civil_file = req.files['registro_civil']?.[0];
      const eps_file = req.files['eps']?.[0];
      const documento_acudiente_file = req.files['documento_acudiente']?.[0];
      const boletines_files = req.files['boletines'] || [];
      
      console.log('Archivos procesados:', {
        carnet_vacunas: carnet_vacunas_file ? `${carnet_vacunas_file.originalname} (${carnet_vacunas_file.size} bytes)` : null,
        fotografia: fotografia_file ? `${fotografia_file.originalname} (${fotografia_file.size} bytes)` : null,
        registro_civil: registro_civil_file ? `${registro_civil_file.originalname} (${registro_civil_file.size} bytes)` : null,
        eps: eps_file ? `${eps_file.originalname} (${eps_file.size} bytes)` : null,
        documento_acudiente: documento_acudiente_file ? `${documento_acudiente_file.originalname} (${documento_acudiente_file.size} bytes)` : null,
        boletines: boletines_files.length
      });

      const query = `
        INSERT INTO academico.inscripciones (
          grado, sub_grado,
          nombre_estudiante, cedula_estudiante, fecha_nacimiento,
          registro_civil_blob, registro_civil_nombre, registro_civil_tipo,
          eps_blob, eps_nombre, eps_tipo,
          sisben,
          carnet_vacunas_blob, carnet_vacunas_nombre, carnet_vacunas_tipo,
          fotografia_blob, fotografia_nombre, fotografia_tipo,
          nombre_acudiente, cedula_acudiente, contacto1, contacto2,
          boletines_blob, boletines_info,
          estado,
          doc_acudiente_blob, doc_acudiente_nombre, doc_acudiente_tipo
        )
        VALUES (
          $1, $2,
          $3, $4, $5,
          $6, $7, $8,
          $9, $10, $11,
          $12,
          $13, $14, $15,
          $16, $17, $18,
          $19, $20, $21, $22,
          $23, $24,
          $25,
          $26, $27, $28
        ) 
      `;

      // Preparar datos de boletines como BLOB
      const boletines_blob_data = boletines_files.map(file => ({
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      }));

      const values = [
        grado,
        subGrado || null,
        nombre_estudiante,
        cedula_estudiante,
        fecha_nacimiento,
        // Registro civil
        registro_civil_file?.buffer || null,
        registro_civil_file?.originalname || null,
        registro_civil_file?.mimetype || null,
        // EPS
        eps_file?.buffer || null,
        eps_file?.originalname || null,
        eps_file?.mimetype || null,
        sisben || null,
        // Carnet vacunas
        carnet_vacunas_file?.buffer || null,
        carnet_vacunas_file?.originalname || null,
        carnet_vacunas_file?.mimetype || null,
        // Fotografía
        fotografia_file?.buffer || null,
        fotografia_file?.originalname || null,
        fotografia_file?.mimetype || null,
        nombre_acudiente,
        cedula_acudiente,
        contacto1,
        contacto2,
        // Boletines como array de BLOB
        boletines_blob_data.length > 0 ? JSON.stringify(boletines_blob_data.map(b => ({
          buffer: b.buffer.toString('base64'),
          originalname: b.originalname,
          mimetype: b.mimetype,
          size: b.size
        }))) : null,
        boletines_blob_data.length > 0 ? JSON.stringify(boletines_blob_data.map(b => ({
          nombre: b.originalname,
          tipo: b.mimetype,
          tamaño: b.size
        }))) : null,
        estado || 'I',
        // Documento acudiente
        documento_acudiente_file?.buffer || null,
        documento_acudiente_file?.originalname || null,
        documento_acudiente_file?.mimetype || null
      ];

      await pool.query(query, values);
      
      console.log('✅ Inscripción guardada en base de datos como BLOB');
      console.log('=== FIN DE REGISTRO BLOB ===');

      res.status(200).json({ 
        mensaje: 'Inscripción registrada con éxito como BLOB',
        archivos_procesados: {
          carnet_vacunas: carnet_vacunas_file ? carnet_vacunas_file.originalname : null,
          fotografia: fotografia_file ? fotografia_file.originalname : null,
          registro_civil: registro_civil_file ? registro_civil_file.originalname : null,
          eps: eps_file ? eps_file.originalname : null,
          documento_acudiente: documento_acudiente_file ? documento_acudiente_file.originalname : null,
          boletines: boletines_files.map(f => f.originalname)
        },
        tamaños: {
          carnet_vacunas: carnet_vacunas_file?.size || 0,
          fotografia: fotografia_file?.size || 0,
          registro_civil: registro_civil_file?.size || 0,
          eps: eps_file?.size || 0,
          documento_acudiente: documento_acudiente_file?.size || 0,
          boletines_total: boletines_files.reduce((sum, f) => sum + f.size, 0)
        }
      });
    } catch (error) {
      console.error('Error al registrar inscripción:', error);
      res.status(500).json({ error: 'Error al registrar la inscripción' });
    }
  }
);

router.get('/getInscritos', getInscritos);

// Método para obtener registros públicos
router.get('/registros/publicos', async (req, res) => {
  try {
    const query = `
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
      LIMIT 50
    `;

    const result = await pool.query(query);

    const registros = result.rows.map(registro => ({
      id: registro.id,
      titulo: `Inscripción - ${registro.nombre_estudiante}`,
      descripcion: `Grado: ${registro.grado}${registro.sub_grado ? ` - ${registro.sub_grado}` : ''}, Acudiente: ${registro.nombre_acudiente}`,
      fecha: registro.created_at,
      archivos: {
        fotografia: registro.fotografia_blob ? {
          data: blobToBase64(registro.fotografia_blob, registro.fotografia_tipo),
          nombre: registro.fotografia_nombre,
          tipo: registro.fotografia_tipo
        } : null,
        carnet_vacunas: registro.carnet_vacunas_blob ? {
          data: blobToBase64(registro.carnet_vacunas_blob, registro.carnet_vacunas_tipo),
          nombre: registro.carnet_vacunas_nombre,
          tipo: registro.carnet_vacunas_tipo
        } : null,
        registro_civil: registro.registro_civil_blob ? {
          data: blobToBase64(registro.registro_civil_blob, registro.registro_civil_tipo),
          nombre: registro.registro_civil_nombre,
          tipo: registro.registro_civil_tipo
        } : null,
        eps: registro.eps_blob ? {
          data: blobToBase64(registro.eps_blob, registro.eps_tipo),
          nombre: registro.eps_nombre,
          tipo: registro.eps_tipo
        } : null,
        boletines: registro.boletines_blob ? JSON.parse(registro.boletines_blob) : [],
        documento_acudiente: registro.doc_acudiente_blob ? {
          data: blobToBase64(registro.doc_acudiente_blob, registro.doc_acudiente_tipo),
          nombre: registro.doc_acudiente_nombre,
          tipo: registro.doc_acudiente_tipo
        } : null
      }
    }));

    res.json(registros);
  } catch (error) {
    console.error('Error al obtener registros públicos:', error);
    res.status(500).json({ error: 'Error al obtener los registros' });
  }
});

// Endpoint para servir archivos BLOB individuales
router.get('/archivo/:id/:tipo', async (req, res) => {
  try {
    const { id, tipo } = req.params;
    
    let columna_blob, columna_nombre, columna_tipo;
    
    switch(tipo) {
      case 'fotografia':
        columna_blob = 'fotografia_blob';
        columna_nombre = 'fotografia_nombre';
        columna_tipo = 'fotografia_tipo';
        break;
      case 'carnet_vacunas':
        columna_blob = 'carnet_vacunas_blob';
        columna_nombre = 'carnet_vacunas_nombre';
        columna_tipo = 'carnet_vacunas_tipo';
        break;
      case 'registro_civil':
        columna_blob = 'registro_civil_blob';
        columna_nombre = 'registro_civil_nombre';
        columna_tipo = 'registro_civil_tipo';
        break;
      case 'eps':
        columna_blob = 'eps_blob';
        columna_nombre = 'eps_nombre';
        columna_tipo = 'eps_tipo';
        break;
      case 'documento_acudiente':
        columna_blob = 'doc_acudiente_blob';
        columna_nombre = 'doc_acudiente_nombre';
        columna_tipo = 'doc_acudiente_tipo';
        break;
      default:
        return res.status(400).json({ error: 'Tipo de archivo no válido' });
    }
    
    const query = `
      SELECT ${columna_blob}, ${columna_nombre}, ${columna_tipo}
      FROM academico.inscripciones 
      WHERE id = $1 AND estado = 'A'
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0 || !result.rows[0][columna_blob]) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    const archivo = result.rows[0];
    const buffer = archivo[columna_blob];
    const nombre = archivo[columna_nombre];
    const mimetype = archivo[columna_tipo];
    
    res.set({
      'Content-Type': mimetype,
      'Content-Disposition': `inline; filename="${nombre}"`,
      'Content-Length': buffer.length
    });
    
    res.send(buffer);
  } catch (error) {
    console.error('Error al servir archivo:', error);
    res.status(500).json({ error: 'Error al obtener el archivo' });
  }
});

// Método para obtener un registro específico
router.get('/registro/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT * FROM academico.inscripciones 
      WHERE id = $1 AND estado = 'A'
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }

    const registro = result.rows[0];
    res.json({
      ...registro,
      boletines: registro.boletines ? JSON.parse(registro.boletines) : []
    });
  } catch (error) {
    console.error('Error al obtener registro:', error);
    res.status(500).json({ error: 'Error al obtener el registro' });
  }
});

// Endpoint de prueba para verificar que los archivos se guardan correctamente
router.get('/test/archivos', (req, res) => {
  const fs = require('fs');
  const path = require('path');

  try {
    const archivosDir = path.resolve('public/registros/archivos');
    const archivos = fs.existsSync(archivosDir) ? fs.readdirSync(archivosDir) : [];

    res.json({
      mensaje: 'Sistema funcionando correctamente',
      carpeta_existe: fs.existsSync(archivosDir),
      ruta_completa: archivosDir,
      archivos_guardados: archivos.length,
      archivos: archivos
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
