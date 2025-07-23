const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const eventos=sequelize.define('eventos', {
    id_evento: {
      type: DataTypes.INTEGER,
        primaryKey: true,
          autoIncrement: true
    },
    detalle: DataTypes.TEXT,
        titulo: DataTypes.TEXT,
    imagen: DataTypes.BLOB, 
  }, {
    tableName: 'eventos',
    schema: 'landing',
    timestamps: false
  });

  module.exports = eventos;