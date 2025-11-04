const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('./config/database'); 

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

// Ruta de bienvenida con enlaces útiles
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Backend INEDAN - Sistema BLOB</title></head>
      <body style="font-family: Arial, sans-serif; margin: 40px;">
        <h1>🎓 Backend INEDAN - Sistema de Inscripciones BLOB</h1>
        <h2>📋 Enlaces de Prueba:</h2>
        <ul>
          <li><a href="/test-blob.html">🗄️ Prueba Sistema BLOB (Nuevo)</a></li>
          <li><a href="/test-cors.html">🔧 Test de CORS</a></li>
          <li><a href="/api/test/archivos">📁 Estado del Sistema</a></li>
          <li><a href="/public/registros/">📊 Registros Públicos BLOB</a></li>
          <li><a href="/api/registros/publicos">🔗 API - Registros JSON BLOB</a></li>
        </ul>
        <h2>📡 API Endpoints BLOB:</h2>
        <ul>
          <li><strong>POST</strong> /api/registro - Registrar inscripción (BLOB)</li>
          <li><strong>GET</strong> /api/registros/publicos - Obtener registros con BLOB</li>
          <li><strong>GET</strong> /api/archivo/:id/:tipo - Servir archivo BLOB individual</li>
          <li><strong>POST</strong> /api/test/upload - Prueba de subida BLOB</li>
        </ul>
        <div style="background: #d1ecf1; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <strong>🗄️ Sistema BLOB Activo:</strong><br>
          • Los archivos se guardan en la base de datos como BLOB<br>
          • No se crean archivos físicos en el servidor<br>
          • Límite: 10MB por archivo, máximo 15 archivos
        </div>
        <p><em>Servidor funcionando en puerto ${port}</em></p>
      </body>
    </html>
  `);
});

// Rutas específicas para páginas de prueba
app.get('/test-blob.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-blob.html'));
});

app.get('/test-cors.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-cors.html'));
});

app.use('/api/landing', landingRoutes);
app.use('/api', userRoutes);
app.use('/api', voteRoutes);
app.use('/api', incripcionRoutes);

// ❗ Esto es lo correcto
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
