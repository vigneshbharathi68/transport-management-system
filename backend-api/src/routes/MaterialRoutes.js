const express = require('express');
const MaterialController = require('../controllers/MaterialController');

const router = express.Router();

// GET /api/materials
router.get('/', (req, res) => MaterialController.getAll(req, res));

// POST /api/materials
router.post('/', (req, res) => MaterialController.create(req, res));

module.exports = router;
