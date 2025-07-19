const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const header=sequelize.define('header', {
    id_header: {
      type: DataTypes.INTEGER,
        primaryKey: true,
          autoIncrement: true
    },
    descripcion: DataTypes.TEXT,
    url: DataTypes.TEXT,
    image: DataTypes.BLOB, // o BLOB("long") para más de 64KB
  }, {
    tableName: 'header',
    schema: 'landing',
    timestamps: false
  });

  module.exports = header;
