const User = require('../models/User');
const typebelongings = require('../models/typebelongings');
const belongings = require('../models/belongings');
const students = require('../models/students');
const slider = require('../models/slider');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { where } = require('sequelize');
require('dotenv').config();

async function getsliderImages(req, res) {
  try {
    const sliderImages = await slider.findAll();
    const sliderImagesmap = sliderImages.map(photo => {
      return {
        ...photo.toJSON(),
        foto: photo.imagen ? `data:image/jpeg;base64,${photo.imagen.toString('base64')}` : null
      };
    });

    res.status(200).json(sliderImagesmap);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener imagenes', error });
  }
}
async function updatesliderImages(req, res) {
  try {
    const { numero } = req.body; // Asegúrate de pasar el id en la URL o en el body
    if (!req.file) {
      return res.status(400).json({ message: "No se subió ningún archivo" });
    }

    const sliderImages = await slider.findOne({ where: { id:numero } });

    if (!sliderImages) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    sliderImages.imagen = req.file.buffer;
    await sliderImages.save();

    res.json({ message: "Imagen actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar imagen", error });
  }
}
async function deleteSliderImage(req, res) {
 try {
  console.log(req.body);
  const { id } = req.body;
  const image = await slider.findByPk(id);
  if (!image) {
    return res.status(404).json({ message: "Imagen no encontrada" });
  }
  await image.destroy();
  res.json({ message: "Imagen eliminada correctamente" });
 } catch (error) {
  res.status(500).json({ message: "Error al eliminar imagen", error });
  console.log(error);
 }}

module.exports = { getsliderImages,updatesliderImages,deleteSliderImage };
