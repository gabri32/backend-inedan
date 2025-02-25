const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Candidates = sequelize.define('Candidate', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  num_identificacion: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true
  },

}, {
  tableName: 'candidatos', 
  schema: 'votaciones', 
  timestamps: false 
});

module.exports = Candidates;