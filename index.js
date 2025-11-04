const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('./config/database'); 
const https = require("https");
const userRoutes = require('./routes/userRoutes');
const voteRoutes = require('./routes/voteRoutes');
const landingRoutes = require('./routes/landingRoutes');
const incripcionRoutes = require('./routes/incripcionRoutes');
const app = express();
const port = process.env.PORT || 3525;

const allowedOrigins = [
  "http://localhost:4200",
  "https://antonio-narino.netlify.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:4200",
      "https://antonio-narino.netlify.app"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE,OPTIONS,PATCH",
  allowedHeaders: "Content-Type,Authorization"
};
app.use(cors(corsOptions));
app.use(bodyParser.json());


const storage = multer.memoryStorage(); // Almacena la imagen en memoria en lugar de en disco
const upload = multer({ storage });
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se subió ningún archivo" });
  }

  res.json({ message: "Imagen subida correctamente", fileSize: req.file.size });
});




// Rutas específicas para páginas de prueba
app.get('/test-blob.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-blob.html'));
});

app.get('/test-cors.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-cors.html'));
});
app.get("/", (req, res) => {
  console.log("Servidor activo");
  res.send("Servidor activo");
});
setInterval(() => {
  https.get("https://backend-inedan-v5q9.onrender.com", (res) => {
    console.log(`Ping enviado, status code: ${res.statusCode}`);
  }).on("error", (err) => {
    console.error("Error en auto-ping:", err.message);
  });
}, 720000); // 120,000 ms = 2 minutos
app.use('/api/landing', landingRoutes);
app.use('/api', userRoutes);
app.use('/api', voteRoutes);
app.use('/api', incripcionRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));
const Curso = require('./models/Curso');
const Asignatura = require('./models/Asignatura');
const Taller = require('./models/talleres');
const Tallerpendiente = require('./models/tallerPendiente');
const students = require('./models/students')
// Relación: Un Taller tiene muchas respuestas
Taller.hasMany(Tallerpendiente, { foreignKey: 'id_taller' });

// Relación: Una respuesta pertenece a un Taller
Tallerpendiente.belongsTo(Taller, { foreignKey: 'id_taller' });

// Asociaciones problemáticas aquí
Asignatura.belongsTo(Curso, { foreignKey: 'id_grado', as: 'curso' });
Tallerpendiente.belongsTo(students, {
  foreignKey: 'num_identificacion',
  as: 'estudiante'
});

app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});
