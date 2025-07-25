require('dotenv').config();
// landingController.js
const pool = require('../db');
const header = require('../models/header');
const eventos = require('../models/eventos'); // Asegúrate de que este modelo exista
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
const getLandingEventos= async (req, res) => {
  try {
    const query = `
      SELECT * FROM landing.eventos
    `;
    const result = await pool.query(query);
    const headers = result.rows.map(header => ({
      ...header,
      imagen: header.imagen ? `data:imagen/jpeg;base64,${header.imagen.toString('base64')}` : null
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

async function insertEventos(req, res) {
  try {
    const { titulo,detalle } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "No se subió ningún archivo" });
    }

    const nuevoHeader = await eventos.create({
      titulo,
      detalle,
      imagen: req.file.buffer, 
    });

    res.status(201).json({
      message: "Encabezado insertado correctamente",
      id: nuevoHeader.id_evento,
    });
  } catch (error) {
    console.error('Error al insertar encabezado:', error);
    res.status(500).json({ message: "Error al insertar encabezado", error });
  }
}
async function deteleHeaders(req, res) {
  try {
    const { id } = req.params;
    const headerToDelete = await header.findByPk(id);

    if (!headerToDelete) {
      return res.status(404).json({ message: "Encabezado no encontrado" });
    }

    await headerToDelete.destroy();
    res.status(200).json({ message: "Encabezado eliminado correctamente" });
  } catch (error) {
    console.error('Error al eliminar encabezado:', error);
    res.status(500).json({ message: "Error al eliminar encabezado", error });
  }
}
async function deleteEventos(req, res) {
  try {
    const { id } = req.params;
    const headerToDelete = await eventos.findByPk(id);

    if (!headerToDelete) {
      return res.status(404).json({ message: "Encabezado no encontrado" });
    }

    await headerToDelete.destroy();
    res.status(200).json({ message: "Encabezado eliminado correctamente" });
  } catch (error) {
    console.error('Error al eliminar encabezado:', error);
    res.status(500).json({ message: "Error al eliminar encabezado", error });
  }
}
module.exports = {
  getLandingSectionsHeader,
  insertHeaders,
  deteleHeaders,
  insertEventos,
  deleteEventos,
  getLandingEventos
};
