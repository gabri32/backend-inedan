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
  foto: {
    type: DataTypes.BLOB("long") 
  },
lema:{
  type:DataTypes.STRING,
  allowNull: true,
},
numero:{
  type:DataTypes.INTEGER,
  allowNull:true
  },
  activo:{
    type:DataTypes.BOOLEAN,
    defaultValue:true
  }
  ,
}, {
  tableName: 'candidatos', 
  schema: 'votaciones', 
  timestamps: false 
});

module.exports = Candidates;