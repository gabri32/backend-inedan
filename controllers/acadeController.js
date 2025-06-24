const students = require('../models/students');
const Profesors = require('../models/profesors');
const Admins = require('../models/admins');
const Sede = require('../models/sede');
const Curso = require('../models/Curso');
const Asignatura = require('../models/Asignatura');
const pool = require('../db');

async function estudiantesAgrupados(req, res) {
  try {
    const result = await pool.query(`
     SELECT grado,sd.detalle as sede, COUNT(*) as cantidad
      FROM academico.estudiantes es
      join academico.sedes  sd ON es.id_sede = sd.id
      GROUP BY grado, id_sede,sd.detalle
      ORDER BY id_sede, grado
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error al agrupar estudiantes:", error);
    return res.status(500).json({ error: "Error en el servidor" });

  }
}
const asignaturasPorGrado = {
  2: [
    { nombre: 'Inglés', horas: 2 },
    { nombre: 'Castellano', horas: 5 },
    { nombre: 'Matemáticas', horas: 5 },
    { nombre: 'Ciencias Naturales', horas: 3 },
    { nombre: 'Tecnología e informática', horas: 2 },
    { nombre: 'Ciencias sociales y competencias ciudadanas', horas: 3 },
    { nombre: 'Educación física, recreación y deporte', horas: 2 },
    { nombre: 'Religión, ética y valores', horas: 1 },
    { nombre: 'Educación artística', horas: 2 },
  ],
  3: [
    { nombre: 'Inglés', horas: 2 },
    { nombre: 'Castellano', horas: 5 },
    { nombre: 'Matemáticas', horas: 5 },
    { nombre: 'Ciencias Naturales', horas: 3 },
    { nombre: 'Tecnología e informática', horas: 2 },
    { nombre: 'Ciencias sociales y competencias ciudadanas', horas: 3 },
    { nombre: 'Educación física, recreación y deporte', horas: 2 },
    { nombre: 'Religión, ética y valores', horas: 1 },
    { nombre: 'Educación artística', horas: 2 },
  ],
  4: [
    { nombre: 'Inglés', horas: 2 },
    { nombre: 'Castellano', horas: 5 },
    { nombre: 'Matemáticas', horas: 5 },
    { nombre: 'Ciencias Naturales', horas: 3 },
    { nombre: 'Tecnología e informática', horas: 2 },
    { nombre: 'Ciencias sociales y competencias ciudadanas', horas: 3 },
    { nombre: 'Educación física, recreación y deporte', horas: 2 },
    { nombre: 'Religión, ética y valores', horas: 1 },
    { nombre: 'Educación artística', horas: 2 },
  ],
  5: [
    { nombre: 'Inglés', horas: 2 },
    { nombre: 'Castellano', horas: 5 },
    { nombre: 'Matemáticas', horas: 5 },
    { nombre: 'Ciencias Naturales', horas: 3 },
    { nombre: 'Tecnología e informática', horas: 2 },
    { nombre: 'Ciencias sociales y competencias ciudadanas', horas: 3 },
    { nombre: 'Educación física, recreación y deporte', horas: 2 },
    { nombre: 'Religión, ética y valores', horas: 1 },
    { nombre: 'Educación artística', horas: 2 },
  ],
  6: [
    { nombre: 'Inglés', horas: 2 },
    { nombre: 'Castellano', horas: 5 },
    { nombre: 'Matemáticas', horas: 5 },
    { nombre: 'Ciencias Naturales', horas: 3 },
    { nombre: 'Tecnología e informática', horas: 2 },
    { nombre: 'Ciencias sociales y competencias ciudadanas', horas: 3 },
    { nombre: 'Educación física, recreación y deporte', horas: 2 },
    { nombre: 'Religión, ética y valores', horas: 1 },
    { nombre: 'Educación artística', horas: 2 },
  ],
  7: [
    { nombre: 'Inglés', horas: 4 },
    { nombre: 'Castellano', horas: 5 },
    { nombre: 'Matemáticas', horas: 5 },
    { nombre: 'Ciencias Naturales', horas: 3 },
    { nombre: 'Tecnología e informática', horas: 2 },
    { nombre: 'Física', horas: 2 },
    { nombre: 'Química', horas: 2 },
    { nombre: 'Ciencias sociales y competencias ciudadanas', horas: 3 },
    { nombre: 'Educación física, recreación y deporte', horas: 2 },
    { nombre: 'Religión, ética y valores', horas: 1 },
    { nombre: 'Educación artística', horas: 2 }
  ],
  8: [
    { nombre: 'Inglés', horas: 4 },
    { nombre: 'Castellano', horas: 5 },
    { nombre: 'Matemáticas', horas: 5 },
    { nombre: 'Ciencias Naturales', horas: 3 },
    { nombre: 'Tecnología e informática', horas: 2 },
    { nombre: 'Física', horas: 2 },
    { nombre: 'Química', horas: 2 },
    { nombre: 'Ciencias sociales y competencias ciudadanas', horas: 3 },
    { nombre: 'Educación física, recreación y deporte', horas: 2 },
    { nombre: 'Religión, ética y valores', horas: 1 },
    { nombre: 'Educación artística', horas: 2 }
  ],
  9: [
    { nombre: 'Inglés', horas: 4 },
    { nombre: 'Castellano', horas: 5 },
    { nombre: 'Matemáticas', horas: 5 },
    { nombre: 'Ciencias Naturales', horas: 3 },
    { nombre: 'Tecnología e informática', horas: 2 },
    { nombre: 'Física', horas: 3 },
    { nombre: 'Química', horas: 3 },
    { nombre: 'Ciencias sociales y competencias ciudadanas', horas: 3 },
    { nombre: 'Sociopolítico y competencias ciudadanas', horas: 4 },
    { nombre: 'Educación física, recreación y deporte', horas: 2 },
    { nombre: 'Religión, ética y valores', horas: 1 },
    { nombre: 'Educación artística', horas: 2 }
  ],
  10: [
    { nombre: 'Inglés', horas: 3 },
    { nombre: 'Castellano', horas: 4 },
    { nombre: 'Filosofía', horas: 2 },
    { nombre: 'Matemáticas', horas: 5 },
    { nombre: 'Ciencias Naturales', horas: 3 },
    { nombre: 'Tecnología e informática', horas: 2 },
    { nombre: 'Física', horas: 3 },
    { nombre: 'Química', horas: 3 },
    { nombre: 'Ciencias sociales y competencias ciudadanas', horas: 3 },
    { nombre: 'Sociopolítico y competencias ciudadanas', horas: 4 },
    { nombre: 'Educación física, recreación y deporte', horas: 2 },
    { nombre: 'Religión, ética y valores', horas: 1 },
    { nombre: 'Educación artística', horas: 2 }
  ],
  11: [
    { nombre: 'Inglés', horas: 3 },
    { nombre: 'Castellano', horas: 3 },
    { nombre: 'Filosofía', horas: 3 },
    { nombre: 'Matemáticas', horas: 4 },
    { nombre: 'Física', horas: 3 },
    { nombre: 'Química', horas: 3 },
    { nombre: 'Ciencias sociales y competencias ciudadanas', horas: 3 },
    { nombre: 'Sociopolítico y competencias ciudadanas', horas: 5 },
    { nombre: 'Educación física, recreación y deporte', horas: 2 },
    { nombre: 'Religión, ética y valores', horas: 1 },
    { nombre: 'Educación artística', horas: 2 }
  ],
  12: [
    { nombre: 'Inglés', horas: 3 },
    { nombre: 'Castellano', horas: 3 },
    { nombre: 'Filosofía', horas: 3 },
    { nombre: 'Matemáticas', horas: 4 },
    { nombre: 'Física', horas: 3 },
    { nombre: 'Química', horas: 3 },
    { nombre: 'Ciencias sociales y competencias ciudadanas', horas: 3 },
    { nombre: 'Sociopolítico y competencias ciudadanas', horas: 5 },
    { nombre: 'Economía política y competencias ciudadanas', horas: 5 },
    { nombre: 'Educación física, recreación y deporte', horas: 2 },
    { nombre: 'Religión, ética y valores', horas: 1 },
    { nombre: 'Educación artística', horas: 2 }
  ]


};
async function crearAsignaturas(idCurso, tipoGrado) {
  const asignaturas = asignaturasPorGrado[tipoGrado];
  if (!asignaturas) return;

  for (const { nombre, horas } of asignaturas) {
    await Asignatura.create({
      descripcion: nombre,
      cantidad_horas_week: horas,
      id_grado: idCurso
    });
    console.log(`Asignatura creada: ${nombre} (${horas}h)`);
  }
}
async function createCurses(req, res) {
  try {
    const result = await pool.query(`
      SELECT grado, sd.detalle AS sede, sd.id AS nombresede, COUNT(*) AS cantidad
      FROM academico.estudiantes es
      JOIN academico.sedes sd ON es.id_sede = sd.id
      GROUP BY grado, id_sede, sd.detalle, sd.id
      ORDER BY id_sede, grado
    `);

    const cursos = result.rows;
    const vigencia = new Date().getFullYear();

    for (const curso of cursos) {
      const { grado, sede, cantidad, nombresede } = curso;
      const tipoGrado = grado + 1;

      const crearCursoSiNoExiste = async (nombreCurso, cantidadCurso) => {
        const existe = await Curso.findOne({
          where: {
            tipo_grado: tipoGrado,
            sede: nombresede,
            nombre: nombreCurso,
            vigencia: vigencia.toString()
          }
        });

        if (!existe) {
          const nuevoCurso = await Curso.create({
            nombre: nombreCurso,
            cantidad: cantidadCurso,
            tipo_grado: tipoGrado,
            sede: nombresede,
            vigencia: vigencia.toString()
          });

          console.log(`Curso creado: ${nuevoCurso.nombre}`);
          await crearAsignaturas(nuevoCurso.id, tipoGrado + 1);
        } else {
          console.log(`Curso ya existe: ${nombreCurso}`);
        }
      };

      if (cantidad > 38) {
        for (let i = 1; i <= 2; i++) {
          const nombreCurso = `Curso ${grado}-${i} - ${sede}`;
          await crearCursoSiNoExiste(nombreCurso, Math.ceil(cantidad / 2));
        }
      } else {
        const nombreCurso = `Curso ${grado} - ${sede}`;
        await crearCursoSiNoExiste(nombreCurso, cantidad);
      }
    }

    return res.json({ message: 'Cursos y asignaturas creadas correctamente.' });
  } catch (error) {
    console.error("Error al crear curso:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}


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
    // 1. Trae todos los profesores con su sede
    const profesores = await Profesors.findAll({
      attributes: ['id_profesor', 'nombre', 'especialidad', 'vigencia', 'sede', 'num_identificacion'],
      include: [
        {
          model: Sede,
          as: 'sede_info',
          attributes: ['id', 'detalle']
        }
      ]
    });

    if (profesores.length === 0) {
      return res.status(404).json({ message: "No se encontraron profesores" });
    }

    // 2. Para cada profesor, busca sus asignaturas
    const profesoresConAsignaturas = await Promise.all(
      profesores.map(async prof => {
        const asignaturas = await Asignatura.findAll({
          where: { id_profesor: prof.id_profesor },
          attributes: ['id_asignatura', 'descripcion', 'cantidad_horas_week', 'id_grado']
        });
        // Convierte a objeto plano y agrega las asignaturas
        const profObj = prof.toJSON();
        profObj.asignaturas = asignaturas;
        return profObj;
      })
    );

    return res.status(200).json(profesoresConAsignaturas);
  } catch (error) {
    console.error("Error al obtener profesores:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}
async function getsedes(req, res) {
  try {
    const sedes = await Sede.findAll({
      attributes: ['id', 'detalle']
    })
    if (sedes.length === 0) {
      return res.status(404).json({ message: "No se encontraron sedes" });
    }
    return res.status(200).json(sedes);
  } catch (error) {
    console.error("Error al obtener sedes:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}
async function createadmins(req, res) {
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
async function getcursos(req, res) {
  try {
    const vigenciaActual = new Date().getFullYear().toString();

    const cursos = await Curso.findAll({
      where: { vigencia: vigenciaActual },
      include: [
        {
          model: Sede,
          as: 'sede_info',
          attributes: ['id', 'detalle']
        },
        {
          model: Profesors,
          as: 'profesor',
          attributes: ['id_profesor', 'nombre']
        },
        {
          model: Asignatura,
          as: 'asignaturas'
          // Puedes agregar attributes si quieres limitar los campos
        }
      ]
    });
    if (cursos.length === 0) {
      return res.status(404).json({ message: "No se encontraron cursos" });
    }
    return res.status(200).json(cursos);
  } catch (error) {
    console.error("Error ", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}
// Crear curso
async function createCurso(req, res) {
  try {
    const { nombre, sede, cantidad, grado } = req.body;
    if (!nombre || !sede) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }
    const nuevoCurso = await Curso.create({
      nombre,
      sede,
      cantidad, // Por defecto
      tipo_grado: grado
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
async function aditasignatura(req, res) {
  try {
    const { id } = req.params;
    const { profesor_id } = req.body;
    const asignatura = await Asignatura.findByPk(id);
    if (!asignatura) {
      return res.status(404).json({ error: "Asignatura no encontrada" });
    }
    if (!profesor_id) {
      return res.status(400).json({ error: "Se requiere profesor_id para actualizar" });
    }
    asignatura.id_profesor = profesor_id;
    await asignatura.save();
    return res.status(200).json({ message: "Curso actualizado", asignatura });
  } catch (error) {
    console.error("Error al editar asignatura:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}
async function deletePropiertiescurso(req, res) {
  try {
    const { id } = req.params;
    const { profesor_id, sede } = req.body;
    //    if (!profesor_id && !sede) {
    //         return res.status(400).json({ error: "Se requiere al menos profesor_id o sede para actualizar" });
    //     }
    const curso = await Curso.findByPk(id);
    if (!curso) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }
    console.log("Curso encontrado:", curso.id);
    curso.profesor_id = null
    if (sede) curso.sede = sede;
    console.log("Curso actualizado:", curso);
    await curso.save();
    return res.status(200).json({ message: "Propiedad eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar propiedad:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }

}
async function deletePropiertieasig(req, res) {
  try {
    const { id } = req.params;
    const asignatura = await Asignatura.findByPk(id);
    if (!asignatura) {
      return res.status(404).json({ error: "Asignatura no encontrada" });
    }
    asignatura.id_profesor = null; // Elimina la asignación del profesor
    await asignatura.save();
    return res.status(200).json({ message: "Propiedad eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar propiedad:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }

}

async function getasignaturas(req, res) {
  try {
    const cursos = await Curso.findAll({
      include: [
        {
          model: Asignatura,
          as: 'asignaturas', // asegúrate de que el alias sea el mismo definido en la asociación
          include: [
            {
              model: Profesors,
              as: 'profesor', // igual, usa el alias definido
              attributes: ['id_profesor', 'nombre']
            }
          ]
        }
      ]
    });

    if (cursos.length === 0) {
      return res.status(404).json({ message: "No se encontraron cursos con asignaturas" });
    }

    return res.status(200).json(cursos);
  } catch (error) {
    console.error("Error al obtener cursos con asignaturas:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}
async function getAsingDocente(req, res) {
  try {
    const { id } = req.query;
    console.log("ID del profesor:", id);
    const result = await pool.query(`SELECT se.detalle, asg.* ,cu.nombre
FROM academico.asignaturas AS asg
JOIN academico.profesores AS pro ON asg.id_profesor = pro.id_profesor
JOIN academico.cursos AS cu ON asg.id_grado = cu.id
JOIN academico.sedes AS se ON cu.sede = se.id
WHERE pro.num_identificacion = '${id}';
    `);

    if (!result) {
      return res.status(404).json({ error: "no existe docente" });
    }
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener docente :", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}

async function createWorks(req, res) {
  const { detalle_taller, fecha_ini, fecha_fin, periodo, doc, doc2, vigencia, id_asignatura } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO academico.talleres (
        detalle_taller,
        id_asignatura,
        fecha_ini,
        fecha_fin,
        periodo,
        vigencia,
        doc,
        doc2
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
      [detalle_taller, id_asignatura, fecha_ini, fecha_fin, periodo, vigencia, doc, doc2]
    );
    return res.status(201).json({ message: "Taller creado exitosamente", taller: result.rows[0] });
  } catch (error) {
    console.error("Error al crear trabajos:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}


async function getTalleres(req, res) {
  try {
    const { id } = req.query;
    const talleres = await pool.query(`
  select ta.*  from academico.talleres ta 
  join academico.asignaturas a on ta.id_asignatura = a.id_asignatura where ta.id_asignatura = ${id}
    `);
    return res.status(200).json(talleres.rows);
  } catch (error) {
    console.error("Error al obtener talleres:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}
module.exports = {
  creationStudent,
  createProfesor,
  createadmins,
  getprofesores,
  getsedes,
  getcursos,
  createCurso,
  editCurso,
  deletePropiertiescurso,
  getasignaturas,
  aditasignatura, deletePropiertieasig,
  estudiantesAgrupados,
  createCurses,
  getAsingDocente,
  createWorks,
  getTalleres
};