const express = require('express');
const router = express.Router();
const multer = require("multer");
const { createUser,
    getUsers,
    login,
    gettypes,
    createproperty,
    getPropertiesC,
    getPropertiesD,
    updatePropierties, deletePropierties, bulkCreateUser,roles } = require('../controllers/userController');
const { creationStudent, createProfesor,
    createadmins, getprofesores, getsedes,
    getcursos, editCurso, createCurso, deletePropiertiescurso,
    getasignaturas, aditasignatura
,deletePropiertieasig,estudiantesAgrupados,createCurses ,getAsingDocente,createWorks,getTalleres,
estudiantesPorgrado,gettotalcursos,actualizarEstudiantesAsignados,consultarEstudianteCursoAsignaturas
,obtenerTalleresPorAsignatura,getdetailTaller,TallerPendiente,getTallerPendiente,updateTaller,getRespuestasPorTaller
,insertNotafromTaller,notasPorEstudiantes,getNotasVistaDocente} = require('../controllers/acadeController')
const { getsliderImages, updatesliderImages } = require('../controllers/manageController')
// Configurar multer para almacenar la imagen en memoria (BLOB)
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.post('/user', createUser);
router.get('/getusers', getUsers);
router.post('/login',login);
router.post('/creationStudent',creationStudent)
router.get('/gettypes',gettypes)
router.post('/createproperty',createproperty)
router.get('/getPropertiesC',getPropertiesC)
router.get('/getPropertiesD',getPropertiesD)
router.post('/updatePropierties',updatePropierties)
router.post('/deletePropierties',deletePropierties)
router.get('/bulkCreateUser',bulkCreateUser)
router.get('/getsliderImages',getsliderImages)
router.post("/updatesliderImages", upload.single("image"), updatesliderImages);
router.post('/createProfesor',createProfesor)
router.post('/createadmins',createadmins)
router.get('/getprofesores',getprofesores)
router.get('/getsedes',getsedes)
router.get('/getcursos',getcursos)
router.post('/createCurso', createCurso);
router.patch('/editCurso/:id', editCurso);
router.patch('/aditasignatura/:id', aditasignatura);
router.patch('/deletePropiertiescurso/:id', deletePropiertiescurso);
router.patch('/deletePropiertieasig/:id', deletePropiertieasig);
router.get('/getasignaturas', getasignaturas);
router.get('/estudiantesAgrupados', estudiantesAgrupados);
router.get('/createCurses', createCurses);
router.get('/getAsingDocente', getAsingDocente);
router.post('/createWorks', createWorks);
router.get('/getTalleres', getTalleres);
router.get('/estudiantesPorgrado', estudiantesPorgrado);
router.get('/gettotalcursos', gettotalcursos);
router.patch('/actualizarEstudiantesAsignados/:id', actualizarEstudiantesAsignados);
router.get('/consultarEstudianteCursoAsignaturas', consultarEstudianteCursoAsignaturas);
router.get('/talleres/asignatura/:id', obtenerTalleresPorAsignatura);
router.get('/roles', roles);
router.get('/getdetailTaller/:id',getdetailTaller)
router.post('/TallerPendiente',upload.single('archivo_pdf'),TallerPendiente)
router.get('/getTallerPendiente/:id_taller/:num_identificacion', getTallerPendiente)
router.put('/updateTaller/:id', updateTaller);
router.get('/talleres/:id/respuestas', getRespuestasPorTaller);
router.post ('/notas/insertNotafromTaller',insertNotafromTaller)
router.get('/notas/:id/:num_identificacion', notasPorEstudiantes);
router.post('/vista-notas-docente', getNotasVistaDocente);

module.exports = router;
    