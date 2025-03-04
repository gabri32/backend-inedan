const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const typebelongings = sequelize.define('typebelongings', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  detalle: {
    type: DataTypes.STRING,
    allowNull: false
  },
 
}, {
  tableName: 'tipo_bien', 
  schema: 'financiero', 
  timestamps: false 
});

module.exports = typebelongings;