const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const slider = sequelize.define('slider', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  imagen: {
    type: DataTypes.BLOB("long"), // Guardar imagen como BLOB largo
    allowNull: true
  },
 
}, {
  tableName: 'slider', 
  schema: 'seguridad', 
  timestamps: false 
});

module.exports = slider;