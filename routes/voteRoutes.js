const express = require('express');
const { createVote, getVotes ,searchStudent,createCandidate,searchCandidate,grafVotes} = require('../controllers/voteController');

const router = express.Router();

router.post('/createvotes', createVote);
router.get('/getvotes', getVotes);
router.get ('/searchStudent',searchStudent)
router.post('/createCandidate',createCandidate)
router.get('/searchCandidate',searchCandidate)
router.get('/grafVotes',grafVotes)
module.exports = router;
