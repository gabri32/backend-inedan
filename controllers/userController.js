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

async function getAllUsers(req, res) {

  try {
    const usuarios = await User.findAll(); // Consulta todos los registros
    return res.status(200).json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
}

async function createUser(req, res) {
  console.log('createUser', req.body);
  const payload = req.body || {};
  const {
    nombre, contrasena, correo, rol_id,
    num_identificacion, edad, grado,
    especialidad, vigencia, sede
  } = payload;

  try {
    if (!nombre || !contrasena) {
      return res.status(400).json({ message: 'Nombre y contraseña son requeridos.' });
    }

    // Validación por tipo de rol
    if (rol_id === 2) { // Estudiante
      if (edad == null || grado == null || grado === '') {
        return res.status(400).json({ message: 'Para rol estudiante se requieren edad y grado.' });
      }
    } else if (rol_id === 1) { // Profesor
      if (!especialidad || sede == null) {
        return res.status(400).json({ message: 'Para rol profesor se requieren especialidad y sede.' });
      }
    } else if (rol_id !== 3) {
      return res.status(400).json({ message: `Rol no reconocido: ${rol_id}` });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const newUser = await User.create({
      nombre,
      correo,
      contraseña: hashedPassword,
      rol_id,
      num_identificacion
    });

    if (rol_id === 3) {
      await Admins.create({
        nombre_completo: nombre,
        num_identificacion,
        correo
      });

    } else if (rol_id === 2) {
      const estudiante = await students.create({
        nombre,
        edad,
        grado,
        num_identificacion,
        id_sede: sede
      });
      console.log("Estudiante creado:", estudiante);

    } else if (rol_id === 1) {
      await Profesors.create({
        nombre,
        especialidad,
        vigencia: typeof vigencia === 'boolean' ? vigencia : true,
        sede,
        num_identificacion
      });
    }

    return res.status(201).json({ message: 'Usuario creado con éxito', user: newUser });

  } catch (error) {
    console.error("Error en createUser:", error);
    return res.status(500).json({ message: 'Error al crear usuario', error: error?.message || error });
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
const eliminarUsuario = async (req, res) => {
  const id = req.params.id;
  try {
    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    await usuario.destroy();
    return res.status(200).json({ message: 'Usuario eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};
const actualizarUsuario = async (req, res) => {
  const id = req.params.id;
  const {
    nombre, correo, rol_id, num_identificacion, contrasena
  } = req.body;

  try {
    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Si incluye contraseña, la hasheamos
    if (contrasena) {
      const bcrypt = require('bcrypt');
      req.body.contraseña = await bcrypt.hash(contrasena, 10);
    }

    await usuario.update(req.body);

    return res.status(200).json({ message: 'Usuario actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

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
module.exports = { createUser, eliminarUsuario,actualizarUsuario,
  getAllUsers,getUsers, login, gettypes, createproperty, getPropertiesC, getPropertiesD, updatePropierties,deletePropierties,bulkCreateUser,roles };
