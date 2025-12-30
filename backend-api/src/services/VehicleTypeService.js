// services/VehicleTypeService.js
const { Pool } = require("pg");
const pool = new Pool(require("../config/database"));
const VehicleTypePresenter = require("../presenters/VehicleTypePresenter");

class VehicleTypeService {
  tableName = 'vehicle_type';
  async getAll() {
    const result = await pool.query(`
            SELECT * FROM ${tableName} 
            WHERE is_active = true 
            ORDER BY name ASC
        `);
    return VehicleTypePresenter.presentList(result.rows);
  }

  async getById(id) {
    const result = await pool.query(
      `SELECT * FROM ${tableName} WHERE id = $1 AND is_active = true`,
      [id]
    );
    if (result.rows.length === 0) {
      throw new Error("Vehicle type not found");
    }
    return VehicleTypePresenter.present(result.rows[0]);
  }

  async create(vehicleTypeData) {
    const { name, code, maxCapacity, maxWeight, ratePerKm } = vehicleTypeData;

    const result = await pool.query(
      `INSERT INTO ${tableName} (name, code, max_capacity, max_weight, rate_per_km, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`,
      [name, code, maxCapacity, maxWeight, ratePerKm]
    );

    return VehicleTypePresenter.present(result.rows[0]);
  }
}

module.exports = new VehicleTypeService();
