const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Profesor = require('./profesors');
const Sede = require('./sede'); 
const Asignatura = require('./Asignatura'); // Asegúrate de que el modelo Asignatura esté definido correctamente
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
  },
  vigencia: DataTypes.STRING,
}, {
     schema: 'academico',
  tableName: 'cursos',
  timestamps: false
});

// Asociaciones
Curso.belongsTo(Profesor, { foreignKey: 'profesor_id', as: 'profesor' });
Curso.belongsTo(Sede, { foreignKey: 'sede', as: 'sede_info' });
Curso.hasMany(Asignatura, { foreignKey: 'id_grado', as: 'asignaturas' });
module.exports = Curso;
