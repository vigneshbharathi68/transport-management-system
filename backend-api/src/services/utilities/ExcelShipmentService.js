// services/ExcelShipmentService.js
const ExcelJS = require("exceljs");
const Database = require("../../lib/db"); // Your Database class

class ExcelShipmentService {
  constructor() {
    this.db = Database; // Use your Database instance
  }

  async parseShipments(filePath) {
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
        status: row.getCell(10).value?.toString()?.trim() || "DRAFT",
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
    if (shipments.length === 0) return { count: 0, data: [] };

    const client = await this.db.getConnection(); // ✅ Use your Database class
    try {
      await client.query("BEGIN");

      // Bulk insert using parameterized query (SAFE!)
      const shipmentValues = shipments.map((s) => [
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

      // Use UNNEST for safe bulk insert
      const flatParams = shipmentValues.flat();
      const placeholders = shipmentValues
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

      const shipmentResult = await client.query(
        `
                INSERT INTO shipment (order_no, group_id, source, destination, material_id, 
                                     vehicle_type_id, weight, volume, quantity, status)
                VALUES ${placeholders}
                RETURNING id, order_no, status, created_at
            `,
        flatParams
      );

      await client.query("COMMIT");
      return {
        count: shipmentResult.rows.length,
        data: shipmentResult.rows,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("❌ Bulk insert error:", error);
      throw error;
    } finally {
      client.release(); // ✅ Proper connection release
    }
  }
}

module.exports = new ExcelShipmentService();
