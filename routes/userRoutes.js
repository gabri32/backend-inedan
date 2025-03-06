const express = require('express');
const { createUser, getUsers,login,gettypes,createproperty,getPropertiesC,getPropertiesD } = require('../controllers/userController');
const{creationStudent}=require('../controllers/acadeController')
const router = express.Router();

router.post('/users', createUser);
router.get('/getusers', getUsers);
router.post('/login',login);
router.post('/creationStudent',creationStudent)
router.get('/gettypes',gettypes)
router.post('/createproperty',createproperty)
router.get('/getPropertiesC',getPropertiesC)
router.get('/getPropertiesD',getPropertiesD)

module.exports = router;
