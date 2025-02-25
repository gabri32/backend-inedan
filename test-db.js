const pool = require('./db');

async function testQuery() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log("🕒 Hora actual en la base de datos:", res.rows[0].now);
  } catch (err) {
    console.error("❌ Error ejecutando consulta:", err);
  }
}

testQuery();
