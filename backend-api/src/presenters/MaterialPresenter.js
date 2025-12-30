class MaterialPresenter {
    static present(material) {
        return {
            id: material.id,
            code: material.code,
            name: material.name,
            category: material.category,
            unit_weight: parseFloat(material.unit_weight) || 0,
            unit_volume: parseFloat(material.unit_volume) || 0,
            total_weight_per_unit: parseFloat(material.unit_weight) || 0,  // kg
            total_volume_per_unit: parseFloat(material.unit_volume) || 0,  // CFT
            is_active: Boolean(material.is_active),
            created_at: material.created_at,
            updated_at: material.updated_at,
        };
    }

    static presentList(materials) {
        return materials.map(this.present);
    }
}

module.exports = MaterialPresenter;
