const express = require("express");
const ShipmentController = require("../controllers/ShipmentController");
const Validation = require("../middleware/validation");

const router = express.Router();

router.post(
  "/",
  Validation.createShipment,
  ShipmentController.createShipment
);
router.get("/", ShipmentController.getAllShipments);
router.get(
  "/:id",
  Validation.getShipment,
  ShipmentController.getShipment
);
router.put(
  "/:id",
  Validation.getShipment,
  ShipmentController.updateShipment
);

router.post("/upload", ShipmentController.uploadShipments);

module.exports = router;
