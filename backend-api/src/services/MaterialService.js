const db = require("../lib/db");
const MaterialPresenter = require("../presenters/MaterialPresenter");

class MaterialService {
  async getAll() {
    const query = `
      SELECT id, code, name, category, unit_weight, unit_volume, is_active,
             created_at, updated_at
      FROM material
      ORDER BY id ASC
    `;
    const result = await db.query(query);

    return MaterialPresenter.presentList(result.rows);
  }

  async getAllIds() {
    const query = `
      SELECT id
      FROM material
      ORDER BY id ASC
    `;
    const result = await db.query(query);
    return result.rows.map((row) => row.id);
  }

  async create(data) {
    const query = `
      INSERT INTO material (code, name, category, unit_weight, unit_volume, is_active)
      VALUES ($1, $2, $3, $4, $5, COALESCE($6, TRUE))
      RETURNING id, code, name, category, unit_weight, unit_volume, is_active, created_at, updated_at
    `;
    const values = [
      data.code,
      data.name,
      data.category,
      data.unit_weight,
      data.unit_volume,
      data.is_active,
    ];
    const result = await db.query(query, values);
    return MaterialPresenter.present(result.rows[0]);
  }
}

module.exports = new MaterialService();
