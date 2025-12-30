const express = require('express');

const VehicleTypeController = require('../controllers/VehicleTypeController');
const router = express.Router();

// GET /api/vehicle-types
router.get('/', (req, res) => VehicleTypeController.getAll(req, res));
// POST /api/vehicle-types
router.post('/', (req, res) => VehicleTypeController.create(req, res));
module.exports = router;
