const express = require("express");
const ShipmentController = require("../controllers/ShipmentController");
const ShipmentValidation = require("../middleware/validation");

const router = express.Router();

router.post(
  "/",
  ShipmentValidation.createShipment,
  ShipmentController.createShipment
);
router.get("/", ShipmentController.getAllShipments);
router.get(
  "/:id",
  ShipmentValidation.getShipment,
  ShipmentController.getShipment
);
router.put(
  "/:id",
  ShipmentValidation.getShipment,
  ShipmentController.updateShipment
);

module.exports = router;
