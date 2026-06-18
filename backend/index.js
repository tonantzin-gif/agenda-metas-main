const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((url) => url.trim())
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:4173'];

function isOriginAllowed(origin) {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (process.env.ALLOW_VERCEL_PREVIEWS === 'true' && /^https:\/\/[\w.-]+\.vercel\.app$/.test(origin)) {
    return true;
  }
  return false;
}

app.use(cors({
  origin: (origin, callback) => callback(null, isOriginAllowed(origin)),
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/meta', require('./routes/metaRoutes'));

app.get('/api/categorias', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Categoria');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al obtener categorías.' });
  }
});

app.get('/', (req, res) => {
  res.send('¡Servidor de la Agenda de Metas corriendo con éxito!');
});

app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ ok: true, db: db.isPostgres ? 'postgresql' : 'mysql' });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

module.exports = app;
