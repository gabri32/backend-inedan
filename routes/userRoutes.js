const express = require('express');
const { createUser, getUsers,login, } = require('../controllers/userController');
const{creationStudent}=require('../controllers/acadeController')
const router = express.Router();

router.post('/users', createUser);
router.get('/getusers', getUsers);
router.post('/login',login);
router.post('/creationStudent',creationStudent)
module.exports = router;
