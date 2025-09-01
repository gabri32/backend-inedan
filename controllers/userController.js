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
  console.time('createUser'); // ⏱️ medir tiempo
  const payload = req.body?.data || {};
  const {
    nombre, contrasena, correo, rol_id,
    num_identificacion, edad, grado,
    especialidad, vigencia, sede
  } = payload;

  // Logs de entrada (sin mostrar contraseña)
  console.log('[createUser] Payload recibido:', {
    nombre, correo, rol_id, num_identificacion, edad, grado, especialidad, vigencia, sede,
    // NUNCA loguees la contraseña en claro
  });

  try {
    // Cast del rol a número por si llega como string desde Angular
    const rol = Number(rol_id);
    console.log('[createUser] rol_id (raw):', rol_id, ' -> rol (Number):', rol, ' typeof raw:', typeof rol_id);

    // Validación base
    if (!nombre || !contrasena) {
      console.warn('[createUser] Falta nombre o contraseña');
      return res.status(400).json({ message: 'Username y password son requeridos' });
    }

    // Validación por rol (logs útiles para saber qué falta)
    if (rol === 2) { // Estudiante
      if (edad == null || grado == null || grado === '') {
        console.warn('[createUser] Faltan campos de estudiante', { edad, grado });
        return res.status(400).json({ message: 'Para rol estudiante (2) se requieren edad y grado' });
      }
    } else if (rol === 1) { // Profesor
      if (!especialidad || sede == null) {
        console.warn('[createUser] Faltan campos de profesor', { especialidad, sede });
        return res.status(400).json({ message: 'Para rol profesor (1) se requieren especialidad y sede' });
      }
    } else if (rol === 3) {
      // Admin no requiere extra, pero lo dejamos anotado
      console.log('[createUser] Rol admin (3) detectado, sin campos extra obligatorios');
    } else {
      console.warn('[createUser] Rol no reconocido:', rol);
      return res.status(400).json({ message: `Rol no reconocido: ${rol}` });
    }

    // Iniciar transacción
    const t = await sequelize.transaction();
    try {
      // Hash
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      console.log('[createUser] Password hasheada correctamente');

      // Crear usuario base
      const newUser = await User.create({
        nombre,
        correo,
        contraseña: hashedPassword, // OJO con el nombre del campo en tu modelo
        rol_id: rol,
        num_identificacion
      }, { transaction: t });

      console.log('[createUser] Usuario creado en User:', newUser?.toJSON?.() || newUser);

      // Insert específico por rol
      if (rol === 3) {
        const admin = await Admins.create({
          nombre_completo: nombre,
          num_identificacion,
          correo
        }, { transaction: t });
        console.log('[createUser] Administrativo creado:', admin?.toJSON?.() || admin);

      } else if (rol === 2) {
        const alumno = await Students.create({
          nombre,
          edad,
          grado,
          num_identificacion
        }, { transaction: t });
        console.log('[createUser] Estudiante creado:', alumno?.toJSON?.() || alumno);

      } else if (rol === 1) {
        const prof = await Profesors.create({
          nombre,
          especialidad,
          vigencia: typeof vigencia === 'boolean' ? vigencia : true,
          sede,
          num_identificacion
        }, { transaction: t });
        console.log('[createUser] Profesor creado:', prof?.toJSON?.() || prof);
      }

      await t.commit();
      console.log('[createUser] Transacción COMMIT');

      console.timeEnd('createUser');
      return res.status(201).json({ message: 'Usuario creado con éxito', user: newUser });

    } catch (errTx) {
      console.error('[createUser] Error dentro de la transacción:', errTx);
      await t.rollback();
      console.log('[createUser] Transacción ROLLBACK');
      return res.status(500).json({ message: 'Error al crear usuario (tx)', error: errTx?.message || errTx });
    }

  } catch (error) {
    console.error('[createUser] Error general:', error);
    console.timeEnd('createUser');
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
