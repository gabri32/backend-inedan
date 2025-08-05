const students = require('../models/students');
const Profesors = require('../models/profesors');
const Admins = require('../models/admins');
const Sede = require('../models/sede');
const Curso = require('../models/Curso');
const Asignatura = require('../models/Asignatura');
const Taller = require('../models/talleres')
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const Tallerpendiente = require(`../models/tallerPendiente`);
const { console } = require('inspector');
// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardan los archivos
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF'));
    }
  }
});
async function estudiantesAgrupados(req, res) {
  try {
    const result = await pool.query(`
  SELECT grado,sd.detalle as sede,sd.id, COUNT(*) as cantidad
      FROM academico.estudiantes es
      join academico.sedes  sd ON es.id_sede = sd.id
      GROUP BY grado, id_sede,sd.detalle,sd.id
      ORDER BY id_sede, grado
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error al agrupar estudiantes:", error);
    return res.status(500).json({ error: "Error en el servidor" });

  }
}
const asignaturasPorGrado = {
  1: [
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
    { nombre: 'Física', horas: 3 },
    { nombre: 'Química', horas: 3 },
    { nombre: 'Ciencias sociales y competencias ciudadanas', horas: 3 },
    { nombre: 'Sociopolítico y competencias ciudadanas', horas: 4 },
    { nombre: 'Educación física, recreación y deporte', horas: 2 },
    { nombre: 'Religión, ética y valores', horas: 1 },
    { nombre: 'Educación artística', horas: 2 }
  ],
  9: [
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
  10: [
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
  11: [
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
      const tipoGrado = grado;

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
          await crearAsignaturas(nuevoCurso.id, tipoGrado);
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
        const nombreCurso = `Curso ${grado}- ${sede}`;
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
    curso.profesor_id = null
    if (sede) curso.sede = sede;
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
  const {
    detalle_taller,
    fecha_ini,
    fecha_fin,
    periodo,
    doc,
    doc2,
    vigencia,
    id_asignatura,
    otro
  } = req.body;

  console.log("📥 Datos recibidos:", req.body);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    console.log("✅ Transacción iniciada.");

    // 👉 1. Insertar taller
    const insertTallerQuery = `
      INSERT INTO academico.talleres (
        detalle_taller,
        id_asignatura,
        fecha_ini,
        fecha_fin,
        periodo,
        vigencia,
        doc,
        doc2,
        tipo_taller
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9)
      RETURNING id_taller;
    `;
    const insertTallerValues = [detalle_taller, id_asignatura, fecha_ini, fecha_fin, periodo, vigencia, doc, doc2,otro];

    const insertTaller = await client.query(insertTallerQuery, insertTallerValues);
    const id_taller = insertTaller.rows[0].id_taller;

    console.log("🆗 Taller insertado con ID:", id_taller);

    // 👉 2. Si se especificó 'otro', procesar estudiantes asignados
    if (otro) {
      console.log("📌 Campo 'otro' es TRUE. Buscando estudiantes asignados...");

      const estudiantesQuery = `
        SELECT tg.estudiantes_asignados
        FROM academico.cursos tg
        JOIN academico.asignaturas a ON tg.id = a.id_grado
        WHERE a.id_asignatura = $1;
      `;
      const result = await client.query(estudiantesQuery, [id_asignatura]);

      if (result.rows.length > 0) {
        const estudiantesAsignados = result.rows[0].estudiantes_asignados;

        if (Array.isArray(estudiantesAsignados) && estudiantesAsignados.length > 0) {
          console.log("👥 Estudiantes asignados:", estudiantesAsignados);

          // Obtener datos de los estudiantes
          const placeholders = estudiantesAsignados.map((_, i) => `$${i + 1}`).join(", ");
          console.log("placeholders",placeholders)


  const estudiantesQuery = `
    SELECT id, num_identificacion
    FROM academico.estudiantes
    WHERE id IN (${placeholders});
  `;


  const estudiantesResult = await client.query(estudiantesQuery, estudiantesAsignados);
  console.log("🎓 Estudiantes obtenidos:", estudiantesResult.rows);
          // Insertar en talleres_pendientes
          for (const est of estudiantesResult.rows) {
            await client.query(
              `INSERT INTO academico.talleres_pendientes (id_taller, num_identificacion)
               VALUES ($1, $2);`,
              [id_taller, est.num_identificacion]
            );
            console.log(`➕ Pendiente añadido: estudiante=${est.num_identificacion}`);
          }

        } else {
          console.log("⚠️ La lista de estudiantes asignados está vacía o no es válida.");
        }

      } else {
        console.log("⚠️ No se encontraron estudiantes asignados para la asignatura.");
      }
    }

    await client.query("COMMIT");
    console.log("✅ Taller y pendientes creados correctamente.");

    return res.status(201).json({
      message: "Taller creado exitosamente",
      id_taller
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error en createWorks:", error);
    return res.status(500).json({ error: "Error al crear el taller" });
  } finally {
    client.release();
    console.log("🔚 Conexión liberada.");
  }
}



async function gettotalcursos(req, res) {
  try {
    const cursos = await pool.query(`
 select * from academico.cursos
    `);
    return res.status(200).json(cursos.rows);
  } catch (error) {
    console.error("Error al obtener cursos:", error);
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

async function estudiantesPorgrado(req, res) {
  try {
    const { grado, sede, id } = req.query;
    const estudiantes = await pool.query(`select * from academico.estudiantes where grado = ${grado} and id_sede = ${sede}`);
    if (estudiantes.rows.length === 0) {
      return res.status(404).json({ message: "No se encontraron estudiantes para este grado" });
    }
    return res.status(200).json(estudiantes.rows);
  } catch (error) {
    console.error("Error al obtener estudiantes por grado:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}

const actualizarEstudiantesAsignados = async (req, res) => {
  const cursoId = req.params.id;
  const { estudiantes } = req.body; // array de IDs
  if (!Array.isArray(estudiantes)) {
    return res.status(400).json({ message: 'El cuerpo debe contener un array de estudiantes.' });
  }

  try {
    await pool.query(` UPDATE academico.cursos 
       SET estudiantes_asignados = to_json($1::int[]) 
       WHERE id = $2`,
      [estudiantes, cursoId]
    );
    return res.status(200).json({ message: 'Estudiantes asignados actualizados correctamente.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al actualizar los estudiantes asignados.' });
  }
};
async function consultarEstudianteCursoAsignaturas(req, res) {
  try {
    const { identificacion } = req.query;

    // 1. Buscar estudiante
    const estudianteResult = await pool.query(
      `SELECT * FROM academico.estudiantes WHERE num_identificacion = $1`,
      [identificacion]
    );

    if (estudianteResult.rowCount === 0) {
      return res.status(404).json({ message: 'Estudiante no encontrado.' });
    }

    const estudiante = estudianteResult.rows[0];
    const gradoEstudiante = estudiante.grado;
    const sede = estudiante.id_sede;
    const id_estudiante = estudiante.id;

    // Buscar cursos donde el id del estudiante esté en el array de estudiantes_asignados
    const cursosResult = await pool.query(
      `SELECT * FROM academico.cursos 
   WHERE tipo_grado = $1 
     AND sede = $2 
     AND estudiantes_asignados @> $3::jsonb`,
      [gradoEstudiante, sede, JSON.stringify([id_estudiante])]
    );


    if (cursosResult.rowCount === 0) {
      return res.status(404).json({ message: 'No hay cursos para este grado.' });
    }

    const idGrado = cursosResult.rows[0].id;

    // 3. Buscar asignaturas para el curso
    const asignaturasResult = await pool.query(
      `SELECT * FROM academico.asignaturas WHERE id_grado = $1`,
      [idGrado]
    );

    return res.status(200).json({
      estudiante,
      cursos: cursosResult.rows,
      asignaturas: asignaturasResult.rows,
    });

  } catch (error) {
    console.error('Error en consulta dinámica:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
}
async function obtenerTalleresPorAsignatura(req, res) {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      `SELECT * FROM academico.talleres WHERE id_asignatura = $1 AND tipo_taller IS NOT NULL AND tipo_taller <> true`,
      [id]
    );

    const talleres = resultado.rows;

    const respuesta = {
      periodo_1: [],
      periodo_2: [],
      periodo_3: []
    };

    for (const taller of talleres) {
      if (taller.periodo === 1) respuesta.periodo_1.push(taller);
      else if (taller.periodo === 2) respuesta.periodo_2.push(taller);
      else if (taller.periodo === 3) respuesta.periodo_3.push(taller);
    }

    res.status(200).json(respuesta);
  } catch (error) {
    console.error('Error al obtener talleres:', error);
    res.status(500).json({ message: 'Error al obtener talleres' });
  }
};
async function getInscritos(req, res) {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `SELECT * FROM academico.inscripciones`
    );
    const inscritos = resultado.rows;
    res.status(200).json(inscritos);

  } catch (error) {
    console.error(error)
    throw error;
  }
}

async function getdetailTaller(req, res) {
  try {
    const { id } = req.params;
    const resultado = await Taller.findByPk(id)
    const taller = resultado;
    res.status(200).json(taller);
  } catch (error) {
    console.error(error)
    throw error;
  }
}


async function TallerPendiente(req, res) {
  try {
    const { id_taller, observaciones, num_identificacion } = req.body;
    const archivo = req.file;

    if (!archivo) {
      return res.status(400).json({ error: 'Archivo PDF requerido' });
    }

    const archivoBuffer = archivo.buffer;

    // Verificar si ya existe
    const existe = await pool.query(
      `SELECT * FROM academico.talleres_pendientes WHERE id_taller = $1 AND num_identificacion = $2`,
      [id_taller, num_identificacion]
    );

    if (existe.rowCount > 0) {
      // Ya existe: hacer UPDATE
      await pool.query(
        `UPDATE academico.talleres_pendientes 
         SET comentario_res = $1, doc = $2
         WHERE id_taller = $3 AND num_identificacion = $4`,
        [observaciones, archivoBuffer, id_taller, num_identificacion]
      );

      return res.status(200).json({ mensaje: 'Taller actualizado correctamente.' });
    } else {
      // No existe: hacer INSERT
      await pool.query(
        `INSERT INTO academico.talleres_pendientes (id_taller, num_identificacion, comentario_res, doc)
         VALUES ($1, $2, $3, $4)`,
        [id_taller, num_identificacion, observaciones, archivoBuffer]
      );

      return res.status(200).json({ mensaje: 'Taller enviado correctamente.' });
    }

  } catch (error) {
    console.error('Error en TallerPendiente:', error);
    return res.status(500).json({ error: 'Error al procesar el taller.' });
  }
}

async function getTallerPendiente(req, res) {
  try {
    const { id_taller, num_identificacion } = req.params;

    const datos = await pool.query(
      `select * from academico.talleres_pendientes where id_taller=$1 and num_identificacion=$2`,
      [id_taller, num_identificacion]
    );
    const respuesta = datos.rows
    res.status(200).json({ respuesta });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar el taller' });
  }
}
async function updateTaller(req, res) {
  try {
    const { id } = req.params;
    const taller = await Taller.findByPk(id);

    if (!taller) {
      return res.status(404).json({ error: 'Taller no encontrado' });
    }
    const {
      detalle_taller,
      periodo,
      fecha_ini,
      fecha_fin,
      doc,
      doc2
    } = req.body;

    // Actualizar solo los campos permitidos
    taller.detalle_taller = detalle_taller ?? taller.detalle_taller;
    taller.periodo = periodo ?? taller.periodo;
    taller.fecha_ini = fecha_ini ?? taller.fecha_ini;
    taller.fecha_fin = fecha_fin ?? taller.fecha_fin;
    taller.doc = doc ?? taller.doc;
    taller.doc2 = doc2 ?? taller.doc2;
    await taller.save();

    return res.status(200).json({ mensaje: 'Taller actualizado correctamente', taller });

  } catch (error) {
    console.error('Error al actualizar taller:', error);
    return res.status(500).json({ error: 'Error del servidor al actualizar el taller' });
  }
}

async function getRespuestasPorTaller(req, res) {
  try {
    const { id } = req.params;
    const respuestas = await Tallerpendiente.findAll({
      where: { id_taller: id },
      include: [
        {
          model: Taller,
          attributes: ['detalle_taller', 'periodo', 'competencia']
        }
      ]
    });

    // 2. Obtener todos los id_pendiente
    const idsPendientes = respuestas.map(r => r.id_pendientes);
    console.log(idsPendientes)
    // 3. Consultar todas las notas de golpe (usamos IN)
    const notas = await pool.query(
      `SELECT * FROM academico.notas WHERE taller_id = ANY($1::int[])`,
      [idsPendientes]
    );
    console.log("datps", notas)
    const notasMap = new Map();
    notas.rows.forEach(nota => {
      notasMap.set(nota.id_pendientes, nota); // clave
    });

    // 4. Enriquecer cada respuesta con su nota (si existe)
    const respuestasConNotas = respuestas.map(r => {
      const nota = notasMap.get(r.id);
      return {
        ...r.toJSON(), // convertir a JSON si viene como modelo Sequelize
        nota: nota?.nota || null,
        descripcion: nota?.descripcion || null
      };
    });

    res.status(200).json(respuestasConNotas);
  } catch (error) {
    console.error('Error al obtener respuestas del taller:', error);
    res.status(500).json({ error: 'Error al obtener las respuestas' });
  }
}


async function insertNotafromTaller(req, res) {
  try {
    const { num_estudiantes, id_taller, descripcion, nota } = req.body;

    // Validación de datos
    if (!num_estudiantes || !id_taller || nota === undefined) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    if (nota < 0 || nota > 5) {
      return res.status(400).json({ error: 'La nota debe estar entre 0 y 5.' });
    }

    // Buscar estudiante
    const estudiante = await pool.query(
      `SELECT * FROM academico.estudiantes WHERE num_identificacion = $1 LIMIT 1`,
      [num_estudiantes]
    );

    if (estudiante.rows.length === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado.' });
    }

    const id = estudiante.rows[0].id;

    // Verificar existencia de nota
    const notaExistente = await pool.query(
      `SELECT * FROM academico.notas 
       WHERE estudiante_id = $1 AND taller_id = $2 LIMIT 1`,
      [id, id_taller]
    );

    if (notaExistente.rows.length > 0) {
      // Actualizar nota
      await pool.query(
        `UPDATE academico.notas 
         SET nota = $1, descripcion = $2 
         WHERE estudiante_id = $3 AND taller_id = $4`,
        [nota, descripcion || '', id, id_taller]
      );
    } else {
      // Insertar nota
      await pool.query(
        `INSERT INTO academico.notas (estudiante_id, taller_id, nota, descripcion)
         VALUES ($1, $2, $3, $4)`,
        [id, id_taller, nota, descripcion || '']
      );
    }

    // ✅ Actualizar "talleres_pendientes" → calificado = true
    await pool.query(
      `UPDATE academico.talleres_pendientes
       SET calificado = true
       WHERE id_pendientes = $1`,
      [id_taller]
    );

    return res.status(200).json({ mensaje: 'Nota guardada y taller marcado como calificado.' });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

async function notasPorEstudiantes(req, res) {
  try {
    const { id, num_identificacion } = req.params;

    console.log("Entró a notasPorEstudiantes");
    console.log("Parámetros recibidos:", id, num_identificacion);
    const d = new Date();
    const year = d.getFullYear();
    const resultado = await pool.query(
      `
    SELECT ta.*, n.nota ,n.descripcion
      FROM academico.asignaturas asi
      JOIN academico.talleres ta ON asi.id_asignatura = ta.id_asignatura
      JOIN academico.talleres_pendientes tp ON ta.id_taller = tp.id_taller
      JOIN academico.notas n ON tp.id_pendientes = n.taller_id
      JOIN academico.estudiantes e ON n.estudiante_id = e.id
      WHERE asi.id_asignatura = $1 AND e.num_identificacion = $2 and ta.vigencia=$3
      `,
      [id, num_identificacion, year]
    );

    console.log("Resultado:", resultado.rows);

    return res.status(200).json({ notas: resultado.rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}
const getNotasVistaDocente = async (req, res) => {
  const { id_asignatura, id_curso,periodo } = req.body; // o req.query si GET

  try {
    // Consulta 1: Talleres de la asignatura
    const talleresQuery = `
      SELECT id_taller, detalle_taller,periodo,vigencia
      FROM academico.talleres
      WHERE id_asignatura = $1 and periodo=$2;
    `;
    const talleresResult = await pool.query(talleresQuery, [id_asignatura,periodo]);

    // Consulta 2: Estudiantes del curso (usando JSON array)
    const estudiantesQuery = `
      SELECT e.id AS estudiante_id, e.nombre, e.num_identificacion
      FROM academico.estudiantes e
      JOIN academico.cursos c ON c.id = $1
      WHERE e.id = ANY (
        SELECT jsonb_array_elements_text(c.estudiantes_asignados)::int
        FROM academico.cursos c
        WHERE c.id = $1
      );
    `;
    const estudiantesResult = await pool.query(estudiantesQuery, [id_curso]);

    // Consulta 3: Notas por taller y estudiante
    const notasQuery = `
      SELECT 
        n.estudiante_id, 
        t.id_taller,
        t.detalle_taller,
        n.nota
      FROM academico.notas n
      JOIN academico.talleres_pendientes tp ON n.taller_id = tp.id_pendientes
      JOIN academico.talleres t ON tp.id_taller = t.id_taller
      WHERE t.id_asignatura = $1;
    `;
    const notasResult = await pool.query(notasQuery, [id_asignatura]);

    // Respuesta agrupada
    res.status(200).json({
      talleres: talleresResult.rows,
      estudiantes: estudiantesResult.rows,
      notas: notasResult.rows,
    });

  } catch (err) {
    console.error("Error al obtener datos:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};




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
  getTalleres,
  estudiantesPorgrado,
  gettotalcursos,
  actualizarEstudiantesAsignados,
  consultarEstudianteCursoAsignaturas,
  obtenerTalleresPorAsignatura,
  getInscritos,
  getdetailTaller,
  TallerPendiente,
  getTallerPendiente,
  updateTaller,
  getRespuestasPorTaller,
  insertNotafromTaller,
  notasPorEstudiantes,
  getNotasVistaDocente
};