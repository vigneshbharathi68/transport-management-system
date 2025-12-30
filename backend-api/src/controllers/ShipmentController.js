const shipmentService = require("../services/ShipmentService");

class ShipmentController {
  async createShipment(req, res) {
    try {
      const shipment = await shipmentService.createShipment(req.body);
      res.status(201).json({
        success: true,
        data: shipment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getShipment(req, res) {
    try {
      const shipment = await shipmentService.getShipmentById(req.params.id);
      if (!shipment) {
        return res.status(404).json({
          success: false,
          error: "Shipment not found",
        });
      }
      res.json({
        success: true,
        data: shipment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getAllShipments(req, res) {
    try {
      const shipments = await shipmentService.getAllShipments();
      res.json({
        success: true,
        data: shipments,
        count: shipments.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async updateShipment(req, res) {
    try {
      const shipment = await shipmentService.updateShipment(
        req.params.id,
        req.body
      );
      res.json({
        success: true,
        data: shipment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async uploadShipments(req, res) {
    try {
      const shipments = await shipmentService.uploadShipments(req.file);
      res.status(201).json({
        success: true,
        data: shipments,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = new ShipmentController();
