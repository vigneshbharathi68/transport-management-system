const materialService = require('../services/MaterialService');

class MaterialController {
  async getAll(req, res) {
    try {
      const materials = await materialService.getAll();
      res.json({ success: true, data: materials });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async create(req, res) {
    try {
      const { code, name, category, unit_weight, unit_volume, is_active } = req.body;

      if (!code || !name || !category) {
        return res.status(400).json({
          success: false,
          error: 'code, name and category are required',
        });
      }

      const material = await materialService.create({
        code,
        name,
        category,
        unit_weight,
        unit_volume,
        is_active,
      });

      res.status(201).json({ success: true, data: material });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = new MaterialController();
