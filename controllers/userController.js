const User = require('../models/User');
const typebelongings = require('../models/typebelongings');
const belongings = require('../models/belongings');
const students = require('../models/students');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { where } = require('sequelize');
require('dotenv').config();
const pool = require('../db');
const Profesors = require('../models/profesors');
const Admins = require('../models/admins');


async function createUser(req, res) {
  try {
    const { nombre, contrasena, correo, rol_id, num_identificacion, edad, grado, especialidad, vigencia, sede } = req.body.data;

    if (!nombre || !contrasena) {
      return res.status(400).json({ message: 'Username y password son requeridos' });
    }

    // 🔒 Hashear contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // 👤 Crear usuario en la tabla principal
    const newUser = await User.create({
      nombre,
      correo,
      contraseña: hashedPassword,
      rol_id,
      num_identificacion
    });

    // 📌 Insertar en tabla según el rol
    if (rol_id === 3) {
      await Admins.create({
        nombre_completo: nombre,
        num_identificacion,
        correo
      });
    } else if (rol_id === 2) {
      await Students.create({
        nombre,
        edad,   // debe venir en el req.body.data
        grado,  // debe venir en el req.body.data
        num_identificacion
      });
    } else if (rol_id === 1) {
      await Profesor.create({
        nombre,
        especialidad, // debe venir en req.body.data
        vigencia: vigencia ?? true, // si no lo mandan, lo pongo en true por defecto
        sede, // id de la sede
        num_identificacion
      });
    }

    res.status(201).json({ message: 'Usuario creado con éxito', user: newUser });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear usuario', error });
  }
}


async function bulkCreateUser(req, res) {
  try {
    const datos = req.body;

    // Obtener la lista de estudiantes
    const studentsList = await students.findAll();
   
    const studentsData = studentsList.map(student => student.dataValues); 

    const usuariosConHash = await Promise.all(
      studentsData.map(async (student) => ({
        nombre: student.nombre,
        num_identificacion: student.num_identificacion,
        rol_id: 2, // Asignar rol_id = 2
        contraseña: await bcrypt.hash(student.num_identificacion.toString(), 10), 
      }))
    );
    // Crear usuarios en bloque
    const newUsers = await User.bulkCreate(usuariosConHash);

    res.status(201).json({ message: 'Usuarios creados', users: newUsers });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuarios', error: error.message });
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

    // Buscar usuario por num_identificacion
    const usuario = await User.findOne({ where: { num_identificacion } });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Comparar contraseña ingresada con la almacenada
    const isMatch = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Buscar si es profesor
    const Profesor = require('../models/profesors');
    const profesor = await Profesor.findOne({ where: { num_identificacion } });

    // Buscar si es estudiante
    const Estudiante = require('../models/students');
    const estudiante = await Estudiante.findOne({ where: { num_identificacion } });

    // Generar el token con JWT
    const token = jwt.sign(
      { id: usuario.id, num_identificacion: usuario.num_identificacion },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Login exitoso',
      user: usuario,
      token: token,
      profesor: profesor || null,
      estudiante: estudiante || null
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
}

async function gettypes(req, res) {
  try {
    const types = await typebelongings.findAll()
    res.status(200).json({ message: 'exito', types: types });
  } catch (error) {
    console.error(error)
  }
}

async function createproperty(req, res) {
  try {
    // Extraer datos del cuerpo de la solicitud
    const properties = req.body;

    // Validar que los campos obligatorios estén presentes
    if (!Array.isArray(properties) || properties.length === 0) {
      return res.status(400).json({ error: "Debe enviar una lista de bienes válida." });
    }
    for (const property of properties) {
      if (!property.detalle || !property.costo || !property.tipo) {
        return res.status(400).json({ error: "Cada bien debe incluir detalle, costo y tipo." });
      }
    }
    // Crear la propiedad en la base de datos
    const createdProperties = await belongings.bulkCreate(properties);

    return res.status(201).json({
      message: "Bienes creados con éxito",
      properties: createdProperties
    });

  } catch (error) {
    console.error("Error al crear propiedad:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}


async function getPropertiesC(req, res) {
  try {
    const consum = await belongings.findAll({
      where: {
        tipo: 1
      }
    });

    res.json(consum);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las propiedades" });
  }
}

async function getPropertiesD(req, res) {
  try {
    const consum = await belongings.findAll({
      where: {
        tipo: 2
      }
    });

    res.json(consum);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las propiedades" });
  }
}



async function updatePropierties(req, res) {
  try {
    const { id_bien, costo, amount } = req.body;
    const updated = await belongings.update(
      {
        costo: costo,
        amount: amount
      }, {
      where: {
        id_bien: id_bien
      }
    })
    return res.status(201).json({
      message: "Biene actualizado con éxito",

    });
  } catch (error) {
    console.error(error)
  }
}
async function deletePropierties(req, res) {
  try {
    const { id_bien} = req.body;
    const destroyed = await belongings.destroy(
     {
      where: {
        id_bien: id_bien
      }
    })
    return res.status(201).json({
      message: "Biene actualizado con éxito",

    });
  } catch (error) {
    console.error(error)
  }
}
async function roles(req, res) {
  try {
    const roles = await pool.query(`select * from seguridad.roles`);
    if (roles.rows.length === 0) {
      return res.status(404).json({ message: "No se encontro" });
    }
    return res.status(200).json(roles.rows);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}   
module.exports = { createUser, getUsers, login, gettypes, createproperty, getPropertiesC, getPropertiesD, updatePropierties,deletePropierties,bulkCreateUser,roles };
