const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sede = sequelize.define('Sede', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  detalle: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
     schema: 'academico',
  tableName: 'sedes',
  timestamps: false
});

module.exports = Sede;
