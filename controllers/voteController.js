const Vote = require('../models/Vote');
const students=require('../models/students')
const Candidate = require('../models/candidate');
const { Op,sequelize } = require('sequelize');
const { QueryTypes } = require('sequelize'); 
const pool = require('../db');
const multer = require('multer');

//funcion que busca los estudiantes de grado 10 y 11
async function searchStudent(req, res) {
  try {
    const studentsList = await students.findAll({
      where: { grado: [11, 12] },
      order: [["grado", "ASC"]], // Ordena en orden ascendente por grado
    });
    return res.status(200).json({ students: studentsList });
  } catch (error) {
    console.error("Error al buscar estudiantes:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}


//funcion que crea un voto

async function createVote(req, res) {
  try {
    const { estudiante_id, candidato_id, id_tipo_vote, es_blanco } = req.body;
    // console.log('📥 Datos recibidos:', req.body);

    // Validar que los datos requeridos estén presentes
    if (!estudiante_id || (!candidato_id && !es_blanco) || !id_tipo_vote) {
      return res.status(400).json({ message: 'Datos incompletos para registrar el voto' });
    }

 
    // Si es un voto en blanco, registrarlo sin candidato
    const newVote = await Vote.create({
      estudiante_id: estudiante_id,
      candidato_id: es_blanco ? null : candidato_id,
      id_tipo_vote,
      es_blanco // Guardamos si el voto es en blanco
    });

    return res.status(201).json({ message: '✅ Voto registrado exitosamente', vote: newVote });
  } catch (error) {
    console.error('❌ Error al registrar voto:', error);
    return res.status(500).json({ message: 'Error interno al registrar voto', error: error.message });
  }
}

//funcion que obtiene los votos
async function getVotes(req, res) {
  try {
    const { estudiante_id } = req.query
    if (!estudiante_id) {
      return res.status(400).json({ message: 'El estudiante_id es requerido' });
    }
    const votes = await Vote.findAll({
      where: { estudiante_id: estudiante_id },
    });
    res.status(200).json(votes);
  } catch (error) {
    console.error('❌ Error al obtener votos:', error);
    res.status(500).json({ message: 'Error al obtener votos', error: error.message });
  }
}

async function grafVotes(req, res) {
  try {
    const query = `
      SELECT 
          c.id AS candidato_id,
          c.nombre AS candidato,
          c.descripcion,
           v.id_tipo_vote,
          COUNT(v.id) AS votos
      FROM votaciones.votos v
    left  JOIN votaciones.candidatos c ON v.candidato_id = c.id
      GROUP BY c.id, c.nombre, c.descripcion,v.id_tipo_vote
      ORDER BY votos DESC;;
    `;

    const { rows } = await pool.query(query);
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('❌ Error al obtener votos:', error);
    res.status(500).json({ message: 'Error al obtener votos', error: error.message });
  }
}
//funcion que crea los candidatos 
async function createCandidate(req, res) {
try {
  const params = req.body;
  // console.log({params})
  if (params.lenght === 0) {
    return res.status(400).json({ message: 'Datos requeridos' });
  }
  const newCandidate = await Candidate.bulkCreate(params);
  res.status(201).json({ message: 'Candidato registrado', candidate: newCandidate })

} catch (error) {
  res.status(500).json({ message: 'Error al registrar candidato', error });
  console.error('error', error)
}};


//funcion que busca los candidatos
async function searchCandidate(req, res) {
  try {
    const candidatesList = await Candidate.findAll();

    const candidatesWithImages = candidatesList.map(candidate => {
      return {
        ...candidate.toJSON(),
        foto: candidate.foto ? `data:image/jpeg;base64,${candidate.foto.toString('base64')}` : null
      };
    });

    return res.status(200).json({ candidates: candidatesWithImages });
  } catch (error) {
    console.error("Error al buscar candidatos:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}


async function removeCandidate(req, res) {
  try {
    const { num_identificacion } = req.body;

    // Validar que se envió el num_identificacion
    if (!num_identificacion) {
      return res.status(400).json({ error: "Número de identificación es obligatorio" });
    }

    // Intentar eliminar el candidato
    const removedCandidate = await Candidate.destroy({
      where: { num_identificacion }
    });

    // Verificar si se eliminó algún registro
    if (removedCandidate === 0) {
      return res.status(404).json({ error: "Candidato no encontrado" });
    }

    return res.status(200).json({ message: "Candidato eliminado correctamente" });

  } catch (error) {
    console.error("Error al eliminar candidato:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}

async function saveImage(req, res) {
  try {
      const { num_identificacion, lema, numero } = req.body;

      // Buscar el candidato por num_identificacion
      const candidate = await Candidate.findOne({ where: { num_identificacion } });

      if (!candidate) {
          return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Si se subió una imagen, guardar en la base de datos como BLOB
      if (req.file) {
          candidate.foto = req.file.buffer;
      } else {
          return res.status(400).json({ message: "No se subió ninguna imagen" });
      }

      // Actualizar otros campos
      candidate.lema = lema;
      candidate.numero = numero;
      await candidate.save();

      res.json({ 
          message: "Imagen actualizada correctamente",
          candidate: {
              num_identificacion: candidate.num_identificacion,
              lema: candidate.lema,
              numero: candidate.numero
          }
      });
  } catch (error) {
      console.error("Error al guardar la imagen:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function saerchidstudent (req,res){
try {

const {num_identificacion}=req.body;
const exist =await students.findOne({where:{num_identificacion}})
res.json({ 
  student: {
      num_identificacion: exist.num_identificacion,
      id: exist.id
  }
});
}catch(error)
{
  console.error("Error :", error);
  res.status(500).json({ error: "Error interno del servidor" });
}
}

module.exports = { createVote, getVotes,searchStudent,createCandidate,searchCandidate,grafVotes,removeCandidate,saveImage,saerchidstudent };
