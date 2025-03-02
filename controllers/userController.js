const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Cargar las variables de entorno
async function createUser(req, res) {
  try {
    const { nombre, contraseña,correo,rol_id } = req.body;
console.log({nombre})
    if (!nombre || !contraseña) {
      return res.status(400).json({ message: 'Username y password son requeridos' });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const newUser = await User.create({ nombre,correo, contraseña: hashedPassword, rol_id });
    res.status(201).json({ message: 'Usuario creado', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario', error });
  }
}

async function getUsers(req, res) {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
}

async function login(req, res) {
  try {

    const { num_identificacion, contraseña } = req.body;

    // Buscar usuario por num
    const usuario = await User.findOne({ where: { num_identificacion } });

    // Verificar si el usuario existe
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Comparar contraseña ingresada con la almacenada
    const isMatch = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }
  // ✅ Generar el token con JWT
  const token = jwt.sign(
    { id: usuario.id, num_identificacion: usuario.num_identificacion }, // Datos del usuario
    process.env.JWT_SECRET, // Clave secreta
    { expiresIn: process.env.JWT_EXPIRES_IN } // Tiempo de expiración
  );
    // Si todo está bien, devolver datos del usuario
    res.status(200).json({ message: 'Login exitoso', user: usuario ,token:token});

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
}



module.exports = { createUser, getUsers,login };
