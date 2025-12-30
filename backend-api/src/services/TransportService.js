const db = require('../lib/db');
const TransportPresenter = require('../presenters/TransportPresenter');

class TransportService {
    async getAll() {
        const query = `SELECT * FROM transport`;
        
        const result = await db.query(query);
        return TransportPresenter.presentList(result.rows);
    }

    async create(data) {
        const query = `
            INSERT INTO transport (vehicle_type_id, status)
            VALUES ($1, COALESCE($2, 'PLANNED'))
            RETURNING id, vehicle_type_id, status, created_at, updated_at
        `;
        
        const values = [data.vehicle_type_id, data.status];
        const result = await db.query(query, values);
        
        // Get vehicle type name
        const vehicleType = await db.query(
            'SELECT id, name FROM vehicle_type WHERE id = $1',
            [data.vehicle_type_id]
        );
        
        const transport = result.rows[0];
        transport.vehicle_type_name = vehicleType.rows[0]?.name;
        transport.shipments_count = 0;
        
        return TransportPresenter.present(transport);
    }

    async getById(id) {
      console.log("TransportService: getById called with id:", id);
        const query = `
            SELECT t.id, t.vehicle_type_id, t.status, t.created_at, t.updated_at,
                   vt.name as vehicle_type_name,
                   COUNT(s.id) as shipments_count
            FROM transport t
            LEFT JOIN vehicle_type vt ON t.vehicle_type_id = vt.id
            LEFT JOIN shipment s ON t.id = s.transport_id
            WHERE t.id = $1
            GROUP BY t.id, t.vehicle_type_id, t.status, t.created_at, t.updated_at, vt.name
        `;
        
        const result = await db.query(query, [id]);
        
        if (result.rows.length === 0) {
            throw new Error('Transport not found');
        }
        
        return TransportPresenter.present(result.rows[0]);
    }
}

module.exports = new TransportService();
