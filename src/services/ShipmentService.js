const db = require("../lib/db");
const ShipmentPresenter = require("../presenters/ShipmentPresenter");

class ShipmentService {
  async createShipment(data) {
    const query = `
            INSERT INTO shipment (order_no, group_id, source, destination, material_id, vehicle_type_id, weight, volume, quantity, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;

    const values = [
      data.order_no,
      data.group_id,
      data.source,
      data.destination,
      data.material_id,
      data.vehicle_type_id,
      data.weight,
      data.volume,
      data.quantity,
      data.status || "DRAFT",
    ];

    const result = await db.query(query, values);
    const material = await db.query(
      "SELECT id, code, name, category FROM material WHERE id = $1",
      [data.material_id]
    );

    const vehicleType = await db.query(
      "SELECT id, name FROM vehicle_type WHERE id = $1",
      [data.vehicle_type_id]
    );

    const shipment = result.rows[0];
    shipment.material_code = material.rows[0]?.code;
    shipment.material_name = material.rows[0]?.name;
    shipment.material_category = material.rows[0]?.category;
    shipment.vehicle_type_name = vehicleType.rows[0]?.name;

    return ShipmentPresenter.present(shipment);
  }

  async getShipmentById(id) {
    const query = `
            SELECT s.*, m.code as material_code, m.name as material_name, m.category as material_category,
                   vt.name as vehicle_type_name
            FROM shipment s
            JOIN material m ON s.material_id = m.id
            JOIN vehicle_type vt ON s.vehicle_type_id = vt.id
            WHERE s.id = $1
        `;

    const result = await db.query(query, [id]);
    return ShipmentPresenter.present(result.rows[0]);
  }

  async getAllShipments() {
    const query = `
            SELECT s.*, m.code as material_code, m.name as material_name, m.category as material_category,
                   vt.name as vehicle_type_name
            FROM shipment s
            JOIN material m ON s.material_id = m.id
            JOIN vehicle_type vt ON s.vehicle_type_id = vt.id
            ORDER BY s.created_at DESC
        `;

    const result = await db.query(query);
    return ShipmentPresenter.presentList(result.rows);
  }

  async updateShipment(id, data) {
    const query = `
            UPDATE shipment 
            SET order_no = $1, group_id = $2, source = $3, destination = $4, 
                material_id = $5, vehicle_type_id = $6, weight = $7, volume = $8, 
                quantity = $9, status = $10, estimated_delivery = $11, actual_delivery = $12,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $13
            RETURNING *
        `;

    const values = [
      data.order_no,
      data.group_id,
      data.source,
      data.destination,
      data.material_id,
      data.vehicle_type_id,
      data.weight,
      data.volume,
      data.quantity,
      data.status,
      data.estimated_delivery,
      data.actual_delivery,
      id,
    ];

    const result = await db.query(query, values);
    return ShipmentPresenter.present(result.rows[0]);
  }
}

module.exports = new ShipmentService();
