const express = require('express');
const router = express.Router();
const { getLandingSections } = require('../controllers/landingController');

router.get('/', getLandingSections);

module.exports = router;
