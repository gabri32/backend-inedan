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
    image: DataTypes.BLOB, 
     enable: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  }
  }, {
    tableName: 'header',
    schema: 'landing',
    timestamps: false
  });

  module.exports = header;
