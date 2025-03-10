const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Estudiante = require('./students'); // Importar modelo Estudiante
const Candidato = require('./candidate'); // Importar modelo Candidato
const students = require('./students');

const Voto = sequelize.define('Voto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  estudiante_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Estudiante,
      key: 'id'
    }
  },
  candidato_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Candidato,
      key: 'id'
    }
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  id_tipo_vote: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  schema: 'votaciones',
  tableName: 'votos',
  timestamps: false
});

// Asociaciones
Voto.belongsTo(Estudiante, { foreignKey: 'estudiante_id', as: 'estudiante' });
Voto.belongsTo(Candidato, { foreignKey: 'candidato_id', as: 'candidato' });

module.exports = Voto;
