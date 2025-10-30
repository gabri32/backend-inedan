# Sistema de Registros Públicos

## Descripción
Este sistema permite guardar y acceder a los registros de inscripciones de manera pública.

## Endpoints disponibles:

### POST /api/registro
Registra una nueva inscripción con archivos adjuntos.
Los archivos se guardan en `public/registros/archivos/`

### GET /api/registros/publicos
Obtiene todos los registros públicos (estado = 'A')
Retorna información básica y rutas de archivos.

### GET /api/registro/:id
Obtiene un registro específico por ID.

### GET /public/registros/index.html
Interfaz web para visualizar los registros públicos.

## Estructura de archivos:
```
public/
├── registros/
│   ├── index.html          # Interfaz web
│   ├── README.md           # Este archivo
│   └── archivos/           # Archivos subidos
│       ├── fotografias/
│       ├── documentos/
│       └── boletines/
```

## Acceso desde el frontend:
- URL base: `http://localhost:3525/public/registros/`
- Archivos: `http://localhost:3525/public/registros/archivos/[nombre-archivo]`
- API: `http://localhost:3525/api/registros/publicos`