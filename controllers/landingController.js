require('dotenv').config();
// landingController.js
const pool = require('../db');
const header = require('../models/header');

const getLandingSectionsHeader = async (req, res) => {
  try {
    const query = `
      SELECT * FROM landing.header
    `;
    const result = await pool.query(query);
    const headers = result.rows.map(header => ({
      ...header,
      image: header.image ? `data:image/jpeg;base64,${header.image.toString('base64')}` : null
    }));
    res.status(200).json(headers);
  } catch (error) {
    console.error('Error al obtener las secciones de la landing:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

async function insertHeaders(req, res) {
  try {
    const { descripcion, url } = req.body;
console.log(req.body.descripcion)
    if (!req.file) {
      return res.status(400).json({ message: "No se subió ningún archivo" });
    }

    const nuevoHeader = await header.create({
      descripcion,
      url,
      image: req.file.buffer, 
    });

    res.status(201).json({
      message: "Encabezado insertado correctamente",
      id: nuevoHeader.id,
    });
  } catch (error) {
    console.error('Error al insertar encabezado:', error);
    res.status(500).json({ message: "Error al insertar encabezado", error });
  }
}

module.exports = {
  getLandingSectionsHeader,
  insertHeaders
};
