const express = require('express');
const { createVote, getVotes ,searchStudent,createCandidate,searchCandidate,grafVotes,removeCandidate,saveImage,
    saerchidstudent,getEventos,registerEventos} = require('../controllers/voteController');
const multer = require("multer");

// Configurar multer para almacenar la imagen en memoria (BLOB)
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post('/createvotes', createVote);
router.get('/getvotes', getVotes);
router.get ('/searchStudent',searchStudent)
router.post('/createCandidate',createCandidate)
router.get('/searchCandidate',searchCandidate)
router.get('/grafVotes',grafVotes)
router.post('/removeCandidate',removeCandidate)
router.post("/saveImage", upload.single("image"), saveImage);
router.post("/saerchidstudent",saerchidstudent)
router.get('/getEventos', getEventos);
router.post('/registerEventos', registerEventos);
module.exports = router;
