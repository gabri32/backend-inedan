const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const voteRoutes = require('./routes/voteRoutes');
require('./config/database'); 
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3525;
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api', userRoutes);
app.use('/api', voteRoutes);

app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});
