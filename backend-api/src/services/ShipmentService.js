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
  async uploadShipments(file) {
    if (!file) {
      throw new Error("No file provided");
    }

    const filePath = file.path;
    console.log("📁 Processing file:", file.filename);

    try {
      // 1. Parse Excel
      const shipments = await this.parseExcelShipments(filePath);

      // 2. Bulk insert to database
      const result = await this.bulkInsertShipments(shipments);

      // 3. Cleanup file
      fs.unlinkSync(filePath);

      return {
        success: true,
        message: `${result.count} shipments created successfully!`,
        totalParsed: shipments.length,
        data: result.data,
        count: result.count,
      };
    } catch (error) {
      // Cleanup on error
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw error;
    }
  }
  async parseExcelShipments(filePath) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);

    const shipments = [];
    let rowCount = 0;

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      rowCount++;
      if (rowNumber === 1) return; // Skip header

      const shipment = {
        order_no:
          row.getCell(1).value?.toString()?.trim() ||
          `ORD-${Date.now()}-${rowNumber}`,
        group_id: row.getCell(2).value?.toString()?.trim() || null,
        source: row.getCell(3).value?.toString()?.trim(),
        destination: row.getCell(4).value?.toString()?.trim(),
        material_id: parseInt(row.getCell(5).value) || 0,
        vehicle_type_id: parseInt(row.getCell(6).value) || 0,
        weight: parseFloat(row.getCell(7).value) || 0,
        volume: parseFloat(row.getCell(8).value) || 0,
        quantity: parseInt(row.getCell(9).value) || 0,
        status:
          row.getCell(10).value?.toString()?.toUpperCase()?.trim() || "DRAFT",
      };

      // Validate required fields
      if (
        shipment.source &&
        shipment.destination &&
        shipment.material_id > 0 &&
        shipment.vehicle_type_id > 0
      ) {
        shipments.push(shipment);
      }
    });

    console.log(
      `📊 Parsed ${shipments.length}/${rowCount - 1} valid shipments`
    );
    return shipments;
  }

  async bulkInsertShipments(shipments) {
    if (shipments.length === 0) {
      return { count: 0, data: [] };
    }

    const client = await db.getConnection();
    try {
      await client.query("BEGIN");

      // Safe parameterized bulk insert
      const values = shipments.map((s) => [
        s.order_no,
        s.group_id,
        s.source,
        s.destination,
        s.material_id,
        s.vehicle_type_id,
        s.weight,
        s.volume,
        s.quantity,
        s.status,
      ]);

      const flatParams = values.flat();
      const placeholders = values
        .map(
          (_, i) =>
            `($${i * 10 + 1}, $${i * 10 + 2}, $${i * 10 + 3}, $${
              i * 10 + 4
            }, $${i * 10 + 5}, 
                  $${i * 10 + 6}, $${i * 10 + 7}, $${i * 10 + 8}, $${
              i * 10 + 9
            }, $${i * 10 + 10})`
        )
        .join(", ");

      const result = await client.query(
        `
                INSERT INTO shipment (order_no, group_id, source, destination, material_id, 
                                     vehicle_type_id, weight, volume, quantity, status)
                VALUES ${placeholders}
                RETURNING id, order_no, source, destination, status, created_at
            `,
        flatParams
      );

      await client.query("COMMIT");
      return { count: result.rows.length, data: result.rows };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new ShipmentService();
