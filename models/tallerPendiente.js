const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tallerpendiente  = sequelize.define('talleres_pendientes', {
  id_pendientes: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  comentario_res: {
    type: DataTypes.STRING,
    allowNull: false
  },
  doc: {
    type: DataTypes.BLOB,
    allowNull: false,
   
  },
  id_taller: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  num_identificacion: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'talleres_pendientes', 
  schema: 'academico', 
  timestamps: false 
});

module.exports = Tallerpendiente;
