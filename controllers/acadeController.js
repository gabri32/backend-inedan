const students = require('../models/students');
const Profesors = require('../models/profesors');
const Admins = require('../models/admins');
const Sede = require('../models/sede');
const Curso = require('../models/Curso');




async function creationStudent(req, res) {
    try { 
        const { nombre, edad, grado, num_identificacion } = req.body;
        if (!nombre || !edad || !grado || !num_identificacion) {
            return res.status(400).json({ error: "Faltan datos requeridos" });
        }
        const [student, created] = await students.findOrCreate({
            where: { num_identificacion },
            defaults: { nombre, edad, grado, num_identificacion }
        });
        if (created) {
            console.log("Estudiante creado exitosamente");
            return res.status(201).json({ message: "Estudiante creado", student });
        } else {
            return res.status(409).json({ error: "El estudiante ya existe", student });
        }

    } catch (error) {
        console.error("Error en creación de estudiante:", error);
        return res.status(500).json({ error: "Error en el servidor" });
    }
}
async function createProfesor(req, res) {
    try {
        const profesores = req.body; // Espera un array de objetos profesor
        if (!Array.isArray(profesores) || profesores.length === 0) {
            return res.status(400).json({ error: "Se requiere un array de profesores" });
        }
        // Filtra los que tengan los campos requeridos
        const profesoresValidos = profesores.filter(p =>
            p.nombre && p.num_identificacion && p.correo && p.num_celular
        );
        if (profesoresValidos.length === 0) {
            return res.status(400).json({ error: "Faltan datos requeridos en todos los profesores" });
        }

        // Elimina duplicados por num_identificacion en el array recibido
        const idsUnicos = new Set();
        const profesoresUnicos = profesoresValidos.filter(p => {
            if (idsUnicos.has(p.num_identificacion)) return false;
            idsUnicos.add(p.num_identificacion);
            return true;
        });

        // Busca los que ya existen en la base de datos
        const existentes = await Profesors.findAll({
            where: {
                num_identificacion: profesoresUnicos.map(p => p.num_identificacion)
            }
        });
        const existentesIds = new Set(existentes.map(e => e.num_identificacion));

        // Filtra los que no existen para crear
        const paraCrear = profesoresUnicos.filter(p => !existentesIds.has(p.num_identificacion));

        // Crea los nuevos profesores
        const creados = await Profesors.bulkCreate(paraCrear);

        res.status(201).json({
            message: "Profesores procesados",
            creados,
            yaExistentes: existentes
        });
    } catch (error) {
        console.error("Error en creación masiva de profesores:", error);
        return res.status(500).json({ error: "Error en el servidor" });
    }
}

async function getprofesores(req, res) {
    try {
        const profesores = await Profesors.findAll({
            attributes: ['id_profesor', 'nombre', 'especialidad', 'vigencia', 'sede', 'num_identificacion'],
            include: [
                {
                    model: Sede,
                    as: 'sede_info', // 
                    attributes: ['id', 'detalle'] // 
                }
            ]
        });
        if (profesores.length === 0) {
            return res.status(404).json({ message: "No se encontraron profesores" });
        }
        return res.status(200).json(profesores);
    } catch (error) {
        console.error("Error al obtener profesores:", error);
        return res.status(500).json({ error: "Error en el servidor" });
    }
}
async function getsedes(req,res){
    try{
const sedes = await Sede.findAll({
            attributes: ['id', 'detalle']
        })
        if (sedes.length === 0) {
            return res.status(404).json({ message: "No se encontraron sedes" });
        }
        return res.status(200).json(sedes);
    }catch(error){
        console.error("Error al obtener sedes:", error);
        return res.status(500).json({ error: "Error en el servidor" });
    } 
}
async function createadmins(req,res) {
    try {
        const { nombre_completo, num_identificacion, correo, perfil_img, num_celular } = req.body;
        if (!nombre_completo || !num_identificacion) {
            return res.status(400).json({ error: "Faltan datos requeridos" });
        }
        const [admin, created] = await Admins.findOrCreate({
            where: { num_identificacion },
            defaults: { nombre_completo, correo, perfil_img, num_celular }
        });
        if (created) {
            console.log("Administrador creado exitosamente");
            return res.status(201).json({ message: "Administrador creado", admin });
        } else {
            return res.status(409).json({ error: "El administrador ya existe", admin });
        }

    } catch (error) {
        console.error("Error en creación de administrador:", error);
        return res.status(500).json({ error: "Error en el servidor" });
    }
    
}
async function getcursos(req,res) {
    try{
        const cursos = await Curso.findAll({
             include: [
                {
                    model: Sede,
                    as: 'sede_info', // 
                    attributes: ['id', 'detalle'] // 
                }
            ]
        });
        if (cursos.length === 0) {
            return res.status(404).json({ message: "No se encontraron cursos" });
        }
        return res.status(200).json(cursos);
    }catch (error) {
        console.error("Error en creación de administrador:", error);
        return res.status(500).json({ error: "Error en el servidor" });
    }
}
// Crear curso
async function createCurso(req, res) {
    try {
        const { nombre, descripcion, sede, ...resto } = req.body;
        if (!nombre || !descripcion || !sede) {
            return res.status(400).json({ error: "Faltan datos requeridos" });
        }
        const nuevoCurso = await Curso.create({
            nombre,
            descripcion,
            sede,
            profesor_id: 35, // Por defecto
            ...resto
        });
        return res.status(201).json({ message: "Curso creado", curso: nuevoCurso });
    } catch (error) {
        console.error("Error al crear curso:", error);
        return res.status(500).json({ error: "Error en el servidor" });
    }
}

// Editar solo profesor_id y sede
async function editCurso(req, res) {
    try {
        const { id } = req.params;
        const { profesor_id, sede } = req.body;
        if (!profesor_id && !sede) {
            return res.status(400).json({ error: "Se requiere al menos profesor_id o sede para actualizar" });
        }
        const curso = await Curso.findByPk(id);
        if (!curso) {
            return res.status(404).json({ error: "Curso no encontrado" });
        }
        if (profesor_id) curso.profesor_id = profesor_id;
        if (sede) curso.sede = sede;
        await curso.save();
        return res.status(200).json({ message: "Curso actualizado", curso });
    } catch (error) {
        console.error("Error al editar curso:", error);
        return res.status(500).json({ error: "Error en el servidor" });
    }
}
module.exports = { creationStudent,createProfesor, createadmins,getprofesores,getsedes,
    getcursos,createCurso,editCurso};