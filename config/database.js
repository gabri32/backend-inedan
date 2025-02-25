const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: { rejectUnauthorized: false } // Necesario para NeonDB
  },
  logging: false, // Evita logs innecesarios en consola
});

sequelize.authenticate()
  .then(() => console.log('✅ Conectado a la base de datos'))
  .catch(err => console.error('❌ Error de conexión:', err));

module.exports = sequelize;

