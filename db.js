require('dotenv').config();
const { Pool } = require('pg');

// Configuración de la conexión
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Importante para NeonDB
});

// Probar conexión
pool.connect()
  .then(client => {
    console.log("✅ Conexión exitosa a PostgreSQL");
    client.release();
  })
  .catch(err => console.error("❌ Error de conexión:", err));

module.exports = pool;
