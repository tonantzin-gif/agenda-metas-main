/**
 * Crea usuario de prueba y verifica categorías.
 * Uso: node scripts/seed.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const bcrypt = require('bcryptjs');
const db = require('../config/db');

const TEST_USER = {
  nombre: 'Usuario Prueba',
  correo: 'prueba@goalflow.com',
  contrasena: 'test1234',
};

async function seed() {
  try {
    const [existentes] = await db.query('SELECT ID_Usuario FROM Usuario WHERE Correo = ?', [TEST_USER.correo]);

    if (existentes.length > 0) {
      console.log('ℹ️  El usuario de prueba ya existe.');
      console.log(`   Correo:    ${TEST_USER.correo}`);
      console.log(`   Contraseña: ${TEST_USER.contrasena}`);
      console.log(`   ID:        ${existentes[0].ID_Usuario}`);
    } else {
      const hash = await bcrypt.hash(TEST_USER.contrasena, 10);
      const [result] = await db.query(
        'INSERT INTO Usuario (Nombre, Correo, Contrasena) VALUES (?, ?, ?)',
        [TEST_USER.nombre, TEST_USER.correo, hash]
      );
      console.log('✅ Usuario de prueba creado.');
      console.log(`   Correo:    ${TEST_USER.correo}`);
      console.log(`   Contraseña: ${TEST_USER.contrasena}`);
      console.log(`   ID:        ${result.insertId}`);
    }

    const [categorias] = await db.query('SELECT ID_Categoria, Nombre FROM Categoria');
    if (categorias.length === 0) {
      await db.query(
        `INSERT INTO Categoria (ID_Categoria, Nombre, Color_Hex) VALUES
         (1, 'Estudio', '#3B82F6'),
         (2, 'Finanzas', '#10B981'),
         (3, 'Salud', '#EF4444'),
         (4, 'Personal', '#8B5CF6')`
      );
      console.log('✅ Categorías iniciales insertadas.');
    } else {
      console.log(`✅ ${categorias.length} categorías encontradas en la BD.`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error.message);
    console.error('   Asegúrate de haber ejecutado el schema en tu base de datos.');
    console.error('   MySQL: database/schema.sql | Supabase: database/schema.postgresql.sql');
    process.exit(1);
  }
}

seed();
