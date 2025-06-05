const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');	


const Admins = sequelize.define('Admin', {
id_admin: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre_completo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  num_identificacion: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  perfil_img:{
     type: DataTypes.BLOB("long")
  },
  num_celular: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  tableName: 'administrativos', 
  schema: 'academico', 
  timestamps: false 
})
module.exports = Admins;