const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Sede = require('./sede');

const Profesor = sequelize.define('Profesor', {
  id_profesor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: DataTypes.STRING,
  especialidad: DataTypes.STRING,
  vigencia: DataTypes.BOOLEAN,
  sede: {
    type: DataTypes.INTEGER,
    references: {
      model: Sede,
      key: 'id'
    }
  },
  num_identificacion: DataTypes.STRING
}, {
     schema: 'academico',
  tableName: 'profesores',
  timestamps: false
});

// Asociaciones
Profesor.belongsTo(Sede, { foreignKey: 'sede', as: 'sede_info' });

module.exports = Profesor;
