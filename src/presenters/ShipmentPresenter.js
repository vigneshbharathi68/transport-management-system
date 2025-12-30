class ShipmentPresenter {
  static present(shipment) {
    return {
      id: shipment.id,
      order_no: shipment.order_no,
      group_id: shipment.group_id,
      source: shipment.source,
      destination: shipment.destination,
      material: {
        id: shipment.material_id,
        code: shipment.material_code,
        name: shipment.material_name,
        category: shipment.material_category,
      },
      vehicle_type: {
        id: shipment.vehicle_type_id,
        name: shipment.vehicle_type_name,
      },
      weight: parseFloat(shipment.weight),
      volume: parseFloat(shipment.volume),
      quantity: parseInt(shipment.quantity),
      total_weight: parseFloat(shipment.weight) * parseInt(shipment.quantity),
      total_volume: parseFloat(shipment.volume) * parseInt(shipment.quantity),
      status: shipment.status,
      estimated_delivery: shipment.estimated_delivery,
      actual_delivery: shipment.actual_delivery,
      created_at: shipment.created_at,
      updated_at: shipment.updated_at,
    };
  }

  static presentList(shipments) {
    return shipments.map(this.present);
  }
}

module.exports = ShipmentPresenter;
