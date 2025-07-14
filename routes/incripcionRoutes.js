const express = require('express');
const router = express.Router();
const pool = require('../db');
const { getInscritos } = require('../controllers/acadeController');
const upload = require('../config/multer.js');

const extraerRuta = (archivo) => {
  return archivo?.path?.replace(/^.*uploads[\\/]/, 'uploads/').replace(/\\/g, '/');
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
module.exports = router;
