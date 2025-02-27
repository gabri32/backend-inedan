const Vote = require('../models/Vote');
const students=require('../models/students')
const Candidate = require('../models/candidate');
const { Op,sequelize } = require('sequelize');
const { QueryTypes } = require('sequelize'); 
const pool = require('../db');

//funcion que busca los estudiantes de grado 10 y 11
async function searchStudent(req, res) {
  try {
    const studentsList = await students.findAll({where:{grado:[10,11]}}); 
    return res.status(200).json({ students: studentsList }); 
  } catch (error) {
    console.error("Error al buscar estudiantes:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}


//funcion que crea un voto

async function createVote(req, res) {
  try {
    const { estudiante_id, candidato_id,id_tipo_vote } = req.body;
console.log('datos de llegada', req.body)
    if (!estudiante_id || !candidato_id) {
      return res.status(400).json({ message: 'Candidato y votante son requeridos' });
    }

    const newVote = await Vote.create({ estudiante_id, candidato_id,id_tipo_vote });
    res.status(201).json({ message: 'Voto registrado', vote: newVote });
  } catch (error) {
    console.error('❌ Error al registrar voto:', error);
    res.status(500).json({ message: 'Error al registrar voto', error });
  }
}
//funcion que obtiene los votos
async function getVotes(req, res) {
  try {
    const votes = await Vote.findAll({
      include: [
        { model: students, as: 'estudiante' },
        { model: Candidate, as: 'candidato' }
      ]
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
          COUNT(v.id) AS votos
      FROM votaciones.votos v
      JOIN votaciones.candidatos c ON v.candidato_id = c.id
      GROUP BY c.id, c.nombre, c.descripcion
      ORDER BY votos DESC;
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
  console.log({params})
  if (params.lenght === 0) {
    return res.status(400).json({ message: 'Datos requeridos' });
  }
  const newCandidate = await Candidate.bulkCreate(params);
  res.status(201).json({ message: 'Candidato registrado', candidate: newCandidate })

} catch (error) {
  res.status(500).json({ message: 'Error al registrar candidato', error });
  console.log('error', error)
}};


//funcion que busca los candidatos
async function searchCandidate(req, res) {
  try {
    const candidatesList = await Candidate.findAll();
    return res.status(200).json({ candidates: candidatesList });
  } catch (error) {
    console.error("Error al buscar candidatos:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}
module.exports = { createVote, getVotes,searchStudent,searchStudent,createCandidate,searchCandidate,grafVotes };
