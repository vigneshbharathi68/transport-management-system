class VehicleTypePresenter {
    static present(vehicleTypeData) {
        return {
            id: vehicleTypeData.id,
            name: vehicleTypeData.name,
            code: vehicleTypeData.code,
            max_capacity: parseFloat(vehicleTypeData.max_capacity),
            max_weight: parseFloat(vehicleTypeData.max_weight),
            rate_per_km: parseFloat(vehicleTypeData.rate_per_km),
            is_active: vehicleTypeData.is_active,
            created_at: vehicleTypeData.created_at,
            updated_at: vehicleTypeData.updated_at,
        }
    }

    static presentList(vehicleTypesData) {
        return vehicleTypesData.map(data => this.present(data));
    }

    static presentResponse(data, total = null) {
        const response = {
            data: Array.isArray(data) ? this.presentList(data) : this.present(data)
        };
        if (total !== null) {
            response.total = total;
        }
        return response;
    }
}

module.exports = VehicleTypePresenter;
