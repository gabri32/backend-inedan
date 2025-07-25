const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Taller = sequelize.define('talleres', {
  id_taller: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  detalle_taller: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_asignatura: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  fecha_ini: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fecha_fin: {
    type: DataTypes.DATE,
    allowNull: false
  },
  periodo:{
    type:DataTypes.INTEGER,
    allowNull:false,
  },
  vigencia:{
      type:DataTypes.INTEGER,
    allowNull:false,
  },
   doc:{
      type:DataTypes.STRING,
    allowNull:false,
  },
   doc2:{
      type:DataTypes.STRING,
    allowNull:false,
  },
  competencia:{
         type:DataTypes.STRING,
    allowNull:false,
  }
}, {
  tableName: 'talleres', 
  schema: 'academico', 
  timestamps: false 
});

module.exports = Taller;
