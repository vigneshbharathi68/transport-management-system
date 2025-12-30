class ShipmentValidation {
  static createShipment(req, res, next) {
    const {
      order_no,
      source,
      destination,
      material_id,
      vehicle_type_id,
      weight,
      volume,
      quantity,
    } = req.body;

    if (
      !order_no ||
      !source ||
      !destination ||
      !material_id ||
      !vehicle_type_id ||
      !weight ||
      !volume ||
      !quantity
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (quantity <= 0 || weight <= 0 || volume <= 0) {
      return res
        .status(400)
        .json({ error: "Weight, volume, and quantity must be positive" });
    }

    next();
  }

  static getShipment(req, res, next) {
    const { id } = req.params;
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ error: "Invalid shipment ID" });
    }
    next();
  }
}

module.exports = ShipmentValidation;
