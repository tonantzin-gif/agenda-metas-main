-- PASO 1 de 2 — Crear tablas
-- En Supabase: SQL Editor → New query → pegar → botón RUN (no EXPLAIN)

CREATE TABLE IF NOT EXISTS "Usuario" (
    "ID_Usuario" SERIAL PRIMARY KEY,
    "Nombre" VARCHAR(100) NOT NULL,
    "Correo" VARCHAR(100) UNIQUE NOT NULL,
    "Contrasena" VARCHAR(255) NOT NULL,
    "Estatus_Activo" BOOLEAN DEFAULT TRUE,
    "Fecha_Creacion" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Categoria" (
    "ID_Categoria" SERIAL PRIMARY KEY,
    "Nombre" VARCHAR(50) NOT NULL,
    "Color_Hex" VARCHAR(7) DEFAULT '#000000'
);

CREATE TABLE IF NOT EXISTS "Etiqueta" (
    "ID_Etiqueta" SERIAL PRIMARY KEY,
    "Nombre" VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "Meta" (
    "ID_Meta" SERIAL PRIMARY KEY,
    "Creador_ID" INT NOT NULL,
    "Responsable_ID" INT NOT NULL,
    "Categoria_ID" INT NOT NULL,
    "Titulo" VARCHAR(150) NOT NULL,
    "Descripcion" TEXT,
    "Prioridad" VARCHAR(20) DEFAULT 'Media' CHECK ("Prioridad" IN ('Baja', 'Media', 'Alta', 'Critica')),
    "Estatus" VARCHAR(20) DEFAULT 'Por Hacer' CHECK ("Estatus" IN ('Por Hacer', 'En Progreso', 'Bloqueado', 'En QA', 'Terminado')),
    "Porcentaje_Actual" INT DEFAULT 0 CHECK ("Porcentaje_Actual" >= 0 AND "Porcentaje_Actual" <= 100),
    "Fecha_Inicio" DATE,
    "Fecha_Limite" DATE,
    "Creado_En" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "Actualizado_En" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("Creador_ID") REFERENCES "Usuario"("ID_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY ("Responsable_ID") REFERENCES "Usuario"("ID_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY ("Categoria_ID") REFERENCES "Categoria"("ID_Categoria") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Subtarea" (
    "ID_Subtarea" SERIAL PRIMARY KEY,
    "Meta_ID" INT NOT NULL,
    "Titulo" VARCHAR(150) NOT NULL,
    "Completada" BOOLEAN DEFAULT FALSE,
    "Fecha_Creacion" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("Meta_ID") REFERENCES "Meta"("ID_Meta") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Meta_Etiqueta" (
    "Meta_ID" INT,
    "Etiqueta_ID" INT,
    PRIMARY KEY ("Meta_ID", "Etiqueta_ID"),
    FOREIGN KEY ("Meta_ID") REFERENCES "Meta"("ID_Meta") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("Etiqueta_ID") REFERENCES "Etiqueta"("ID_Etiqueta") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Avance" (
    "ID_Avance" SERIAL PRIMARY KEY,
    "Meta_ID" INT NOT NULL,
    "Usuario_ID" INT NOT NULL,
    "Porcentaje_Reportado" INT NOT NULL CHECK ("Porcentaje_Reportado" >= 0 AND "Porcentaje_Reportado" <= 100),
    "Comentarios" TEXT NOT NULL,
    "Evidencia_URL" VARCHAR(255),
    "Fecha_Registro" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("Meta_ID") REFERENCES "Meta"("ID_Meta") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("Usuario_ID") REFERENCES "Usuario"("ID_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);
