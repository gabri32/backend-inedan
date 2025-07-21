const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); 

const { getLandingSectionsHeader,insertHeaders,deteleHeaders,insertEventos,deleteEventos,getLandingEventos } = require('../controllers/landingController');

router.get('/getheaders', getLandingSectionsHeader);
router.get('/getLandingEventos', getLandingEventos);
router.post('/insertHeader', upload.single('image'), insertHeaders);
router.delete('/deleteHeader/:id', deteleHeaders);
router.post('/insertEventos', upload.single('imagen'), insertEventos);
router.delete('/deleteEventos/:id', deleteEventos);

module.exports = router;
