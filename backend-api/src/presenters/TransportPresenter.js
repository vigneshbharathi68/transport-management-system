class TransportPresenter {
    static present(transport) {
        return {
            id: transport.id,
            vehicle_type_id: transport.vehicle_type_id,
            status: transport.status,
            created_at: transport.created_at,
            updated_at: transport.updated_at
        };
    }

    static presentList(transports) {
        return transports.map(this.present);
    }
}

module.exports = TransportPresenter;
