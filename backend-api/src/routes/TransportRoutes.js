const express = require('express');
const TransportController = require('../controllers/TransportController');

const router = express.Router();

// GET /api/transports
router.get('/', (req, res) => TransportController.getAll(req, res));
router.get('/:id', (req, res) => TransportController.getById(req, res));

// POST /api/transports
router.post('/', (req, res) => TransportController.create(req, res));

module.exports = router;
