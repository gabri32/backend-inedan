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

app.use(cors());
app.use(bodyParser.json());

// Configurar Multer para guardar imágenes en la carpeta "uploads"
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se subió ningún archivo" });
  }

  const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;

  res.json({ message: "Imagen subida correctamente", imageUrl });
});


app.use('/api', userRoutes);
app.use('/api', voteRoutes);

app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});
