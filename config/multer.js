const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve('uploads'));
  },
  filename: (req, file, cb) => {
    // Genera un nombre único: <uuid>.<ext>
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});


module.exports = multer({ storage });
