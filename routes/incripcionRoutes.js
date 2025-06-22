const express = require('express');
const router = express.Router();
const pool = require('../db');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  '/registro',
  upload.fields([
    { name: 'carnet_vacunas', maxCount: 1 },
    { name: 'fotografia', maxCount: 1 },
    { name: 'boletines', maxCount: 10 }
  ]),
  async (req, res) => {
    try {
      const {
        grado,
        subGrado,
        nombre_estudiante,
        cedula_estudiante,
        fecha_nacimiento,
        registro_civil,
        eps,
        sisben,
        nombre_acudiente,
        cedula_acudiente,
        contacto1,
        contacto2,
        estado
      } = req.body;

      const carnet_vacunas = req.files['carnet_vacunas']?.[0]?.buffer || null;
      const fotografia = req.files['fotografia']?.[0]?.buffer || null;

      const boletines = (req.files['boletines'] || []).map((file) => file.buffer);

      const query = `
        INSERT INTO academico.inscripciones (
          grado, sub_grado,
          nombre_estudiante, cedula_estudiante, fecha_nacimiento,
          registro_civil, eps, sisben,
          carnet_vacunas, fotografia,
          nombre_acudiente, cedula_acudiente, contacto1, contacto2,
          boletines, estado
        )
        VALUES (
          $1, $2,
          $3, $4, $5,
          $6, $7, $8,
          $9, $10,
          $11, $12, $13, $14,
          $15, $16
        ) 
      `;

      const values = [
        grado,
        subGrado || null,
        nombre_estudiante,
        cedula_estudiante,
        fecha_nacimiento,
        registro_civil,
        eps,
        sisben || null,
        carnet_vacunas,
        fotografia,
        nombre_acudiente,
        cedula_acudiente,
        contacto1,
        contacto2,
        boletines,
        estado || 'I' // Valor por defecto 'I' si no lo mandan
      ];

      await pool.query(query, values);

      res.status(200).json({ mensaje: 'Inscripción registrada con éxito' });
    } catch (error) {
      console.error('Error al registrar inscripción:', error);
      res.status(500).json({ error: 'Error al registrar la inscripción' });
    }
  }
);

module.exports = router;
