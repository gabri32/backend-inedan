const students = require('../models/students');

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


module.exports = { creationStudent };