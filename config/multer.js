const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Crear las carpetas si no existen
const publicDir = path.resolve('public');
const registrosDir = path.resolve('public/registros');
const archivosDir = path.resolve('public/registros/archivos');

[publicDir, registrosDir, archivosDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, archivosDir);
  },
  filename: (req, file, cb) => {
    // Genera un nombre único: <uuid>.<ext>
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

module.exports = multer({ storage });
