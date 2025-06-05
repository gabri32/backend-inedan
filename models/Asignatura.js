const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Profesor = require('./profesors');

const Asignatura = sequelize.define('Asignatura', {
  id_asignatura: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descripcion: DataTypes.STRING,
  id_profesor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Profesor,
      key: 'id_profesor'
    }
  },
  id_grado: DataTypes.INTEGER
}, {
     schema: 'academico',
  tableName: 'asignaturas',
  timestamps: false
});

// Asociaciones
Asignatura.belongsTo(Profesor, { foreignKey: 'id_profesor', as: 'profesor' });

module.exports = Asignatura;
