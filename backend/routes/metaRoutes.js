const express = require('express');
const router = express.Router();
const metaController = require('../controllers/metaController');
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Meta');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error al obtener metas.' });
    }
});

router.post('/', metaController.crearMeta);
router.put('/estatus/:id', metaController.cambiarEstatusMeta);
router.put('/:id', metaController.actualizarMeta);
router.delete('/:id', metaController.eliminarMeta);
router.get('/progreso/:usuarioId', metaController.obtenerProgresoGeneral);

module.exports = router;
