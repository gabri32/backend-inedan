const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const students = sequelize.define('Students', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  edad: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  grado: {
    type: DataTypes.STRING, 
    allowNull: false
  },
  num_identificacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique:true
  }
}, {
  tableName: 'estudiantes', 
  schema: 'academico', 
  timestamps: false 
});

module.exports = students;