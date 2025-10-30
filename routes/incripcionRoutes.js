const express = require('express');
const router = express.Router();
const pool = require('../db');
const { getInscritos } = require('../controllers/acadeController');
const upload = require('../config/multer.js');

const extraerRuta = (archivo) => {
  if (!archivo?.path) return null;
  // Extraer solo el nombre del archivo y crear la ruta pública
  const filename = archivo.filename || archivo.path.split(/[\\/]/).pop();
  return `public/registros/archivos/${filename}`;
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

      const carnet_vacunas = extraerRuta(req.files['carnet_vacunas']?.[0]) || null;
      const fotografia = extraerRuta(req.files['fotografia']?.[0]) || null;
      const registro_civil_file = extraerRuta(req.files['registro_civil']?.[0]) || null;
      const eps_file = extraerRuta(req.files['eps']?.[0]) || null;
      const documento_acudiente = extraerRuta(req.files['documento_acudiente']?.[0]) || null;
      const boletines = (req.files['boletines'] || []).map(file => extraerRuta(file));

      const query = `
        INSERT INTO academico.inscripciones (
          grado, sub_grado,
          nombre_estudiante, cedula_estudiante, fecha_nacimiento,
          registro_civil, eps, sisben,
          carnet_vacunas, fotografia,
          nombre_acudiente, cedula_acudiente, contacto1, contacto2,
          boletines, estado, doc_acudiente
        )
        VALUES (
          $1, $2,
          $3, $4, $5,
          $6, $7, $8,
          $9, $10,
          $11, $12, $13, $14,
          $15, $16, $17
        ) 
      `;

      const values = [
        grado,
        subGrado || null,
        nombre_estudiante,
        cedula_estudiante,
        fecha_nacimiento,
        registro_civil_file,
        eps_file,
        sisben || null,
        carnet_vacunas,
        fotografia,
        nombre_acudiente,
        cedula_acudiente,
        contacto1,
        contacto2,
        JSON.stringify(boletines),
        estado || 'I',
        documento_acudiente || null
      ];

      await pool.query(query, values);

      res.status(200).json({ mensaje: 'Inscripción registrada con éxito' });
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
        fotografia,
        carnet_vacunas,
        registro_civil,
        eps,
        boletines,
        doc_acudiente,
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
        fotografia: registro.fotografia,
        carnet_vacunas: registro.carnet_vacunas,
        registro_civil: registro.registro_civil,
        eps: registro.eps,
        boletines: registro.boletines ? JSON.parse(registro.boletines) : [],
        documento_acudiente: registro.doc_acudiente
      }
    }));

    res.json(registros);
  } catch (error) {
    console.error('Error al obtener registros públicos:', error);
    res.status(500).json({ error: 'Error al obtener los registros' });
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
