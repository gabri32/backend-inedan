const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Profesor = require('./profesors');

const Curso = sequelize.define('Curso', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: DataTypes.STRING,
  profesor_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Profesor,
      key: 'id_profesor'
    }
  },
  tipo_grado: DataTypes.INTEGER,
  cantidad: DataTypes.INTEGER,
  sede:DataTypes.INTEGER
}, {
     schema: 'academico',
  tableName: 'cursos',
  timestamps: false
});

// Asociaciones
Curso.belongsTo(Profesor, { foreignKey: 'profesor_id', as: 'profesor' });

module.exports = Curso;
