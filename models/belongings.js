const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const typebelongings=require('./typebelongings')
const belongings = sequelize.define('belongings', {
  id_bien: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  detalle: {
    type: DataTypes.STRING,
    allowNull: false
  },
 costo:{
    type:DataTypes.INTEGER,
    allowNull: false
 },
tipo:{
    type: DataTypes.INTEGER,
    allowNull:false,
},
amount:{
  type:DataTypes.INTEGER,
  allowNull:true
}
}, {
  tableName: 'bienes', 
  schema: 'financiero', 
  timestamps: false 
});
belongings.belongsTo(typebelongings, { foreignKey: 'tipo' });
typebelongings.hasMany(belongings, { foreignKey: 'tipo' });
module.exports = belongings;