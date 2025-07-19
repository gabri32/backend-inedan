const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); 

const { getLandingSectionsHeader,insertHeaders } = require('../controllers/landingController');

router.get('/getheaders', getLandingSectionsHeader);
router.post('/insertHeader', upload.single('image'), insertHeaders);

module.exports = router;
