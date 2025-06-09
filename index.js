const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('./config/database'); 

const userRoutes = require('./routes/userRoutes');
const voteRoutes = require('./routes/voteRoutes');

const app = express();
const port = process.env.PORT || 3525;

const allowedOrigins = [
  "http://localhost:4200",
  "https://antonio-narino.netlify.app"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS,PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Manejo del preflight request
  }
  
  next();
});

app.use(bodyParser.json());


const storage = multer.memoryStorage(); // Almacena la imagen en memoria en lugar de en disco
const upload = multer({ storage });
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se subió ningún archivo" });
  }

  res.json({ message: "Imagen subida correctamente", fileSize: req.file.size });
});


app.use('/api', userRoutes);
app.use('/api', voteRoutes);
const Curso = require('./models/Curso');
const Asignatura = require('./models/Asignatura');

// Asociaciones problemáticas aquí
Asignatura.belongsTo(Curso, { foreignKey: 'id_grado', as: 'curso' });

app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});
