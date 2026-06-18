-- PASO 2 de 2 — Insertar categorías iniciales
-- Ejecutar DESPUÉS de 01-crear-tablas.sql
-- Botón RUN (no EXPLAIN)

INSERT INTO "Categoria" ("ID_Categoria", "Nombre", "Color_Hex") VALUES
(1, 'Estudio', '#3B82F6'),
(2, 'Finanzas', '#10B981'),
(3, 'Salud', '#EF4444'),
(4, 'Personal', '#8B5CF6')
ON CONFLICT ("ID_Categoria") DO NOTHING;

SELECT setval(pg_get_serial_sequence('"Categoria"', 'ID_Categoria'), 4, true);
