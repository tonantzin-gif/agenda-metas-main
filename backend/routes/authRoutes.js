const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario } = require('../controllers/authController');

// Ruta para Registro: /api/auth/register
router.post('/register', registrarUsuario);

// Ruta para Login: /api/auth/login 👈 ¡La nueva ruta!
router.post('/login', loginUsuario);

module.exports = router;