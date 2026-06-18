const mysql = require('mysql2/promise');
require('dotenv').config();

const isPostgres = Boolean(process.env.DATABASE_URL);
let pool;
let PgPool;

function getPgPool() {
  if (!PgPool) {
    ({ Pool: PgPool } = require('pg'));
  }
  return PgPool;
}

const PG_IDENTIFIERS = [
  'Meta_Etiqueta', 'ID_Subtarea', 'ID_Categoria', 'ID_Usuario', 'ID_Etiqueta', 'ID_Meta', 'ID_Avance',
  'Responsable_ID', 'Creador_ID', 'Categoria_ID', 'Porcentaje_Actual', 'Porcentaje_Reportado',
  'Fecha_Creacion', 'Fecha_Registro', 'Estatus_Activo', 'Color_Hex', 'Fecha_Inicio', 'Fecha_Limite',
  'Creado_En', 'Actualizado_En', 'Evidencia_URL', 'Usuario_ID', 'Meta_ID', 'Etiqueta_ID',
  'Usuario', 'Categoria', 'Etiqueta', 'Meta', 'Subtarea', 'Avance',
  'Nombre', 'Correo', 'Contrasena', 'Titulo', 'Descripcion', 'Prioridad', 'Estatus', 'Comentarios', 'Completada',
].sort((a, b) => b.length - a.length);

function quoteIdentifiersForPostgres(sql) {
  let result = sql;
  for (const id of PG_IDENTIFIERS) {
    result = result.replace(new RegExp(`(?<![\"'])\\b${id}\\b(?![\"'])`, 'g'), `"${id}"`);
  }
  return result;
}

function toPgPlaceholders(sql) {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
}

function getInsertReturningColumn(sql) {
  if (/INSERT\s+INTO\s+"?Usuario"?/i.test(sql)) return 'ID_Usuario';
  if (/INSERT\s+INTO\s+"?Meta"?/i.test(sql)) return 'ID_Meta';
  return null;
}

if (isPostgres) {
  pool = new (getPgPool())({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
  });
} else {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'db_agenda_metas',
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

async function query(sql, params = []) {
  if (isPostgres) {
    let pgSql = quoteIdentifiersForPostgres(sql);
    pgSql = toPgPlaceholders(pgSql);
    const returningColumn = getInsertReturningColumn(sql);

    if (returningColumn && !/RETURNING/i.test(pgSql)) {
      pgSql += ` RETURNING "${returningColumn}"`;
    }

    const result = await pool.query(pgSql, params);

    if (/^\s*SELECT/i.test(sql)) {
      return [result.rows, result.fields];
    }

    const header = {
      insertId: returningColumn ? result.rows[0]?.[returningColumn] : undefined,
      affectedRows: result.rowCount,
    };

    return [header, result.fields];
  }

  return pool.query(sql, params);
}

async function testConnection() {
  try {
    if (isPostgres) {
      const client = await pool.connect();
      console.log('✅ Conexión exitosa a PostgreSQL (Supabase).');
      client.release();
    } else {
      const connection = await pool.getConnection();
      console.log('✅ Conexión exitosa a MySQL/MariaDB.');
      connection.release();
    }
  } catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err.message);
    if (isPostgres) {
      console.error('   Verifica en backend/.env que la línea empiece con DATABASE_URL=');
      console.error('   Usa la URI de: Supabase → Settings → Database → Connection string → URI');
      if (err.message.includes('ENOTFOUND') || err.message.includes('tenant/user')) {
        console.error('   Si usas pooler, el usuario debe ser postgres.TU_REF (no solo postgres).');
        console.error('   Prueba la conexión directa: db.TU_REF.supabase.co:5432');
      }
      if (err.message.includes('password authentication failed')) {
        console.error('   Contraseña incorrecta. Resetea en Supabase → Settings → Database.');
      }
    }
  }
}

if (!process.env.VERCEL) {
  testConnection();
}

module.exports = { query, isPostgres };
