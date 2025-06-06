const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Profesor = require('./profesors');
const Sede = require('./sede'); // Asegúrate de que el modelo Sede esté definido correctamente
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
  sede:{
    type:DataTypes.INTEGER,
     references: {
      model: Sede,
      key: 'id'
    }
  }
}, {
     schema: 'academico',
  tableName: 'cursos',
  timestamps: false
});

// Asociaciones
Curso.belongsTo(Profesor, { foreignKey: 'profesor_id', as: 'profesor' });
Curso.belongsTo(Sede, { foreignKey: 'sede', as: 'sede_info' });
module.exports = Curso;
