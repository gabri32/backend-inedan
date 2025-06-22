require('dotenv').config();
// landingController.js
const pool = require('../db');

const getLandingSections = async (req, res) => {
  try {
    const query = `
      SELECT * FROM landing.landing_sections
      WHERE active = true
      ORDER BY "order"
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener las secciones de la landing:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getLandingSections,
};
