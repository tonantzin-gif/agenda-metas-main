require('dotenv').config();
const db = require('../config/db');

async function check() {
  await new Promise((r) => setTimeout(r, 2000));

  try {
    const [tables] = await db.query(
      `SELECT table_name FROM information_schema.tables 
       WHERE table_schema = 'public' AND table_name IN ('Usuario', 'Categoria', 'Meta')`
    );
    console.log('Tablas encontradas:', tables.map((t) => t.table_name).join(', ') || '(ninguna)');

    if (tables.length === 0) {
      console.log('\n⚠️  Ejecuta database/schema.postgresql.sql en Supabase SQL Editor (botón RUN).');
      process.exit(1);
    }

    const [cats] = await db.query('SELECT "ID_Categoria", "Nombre" FROM "Categoria"');
    console.log('Categorías:', cats.length);
    cats.forEach((c) => console.log(`  - ${c.ID_Categoria}: ${c.Nombre}`));

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

check();
