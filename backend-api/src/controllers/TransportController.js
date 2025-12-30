const transportService = require('../services/TransportService');

class TransportController {
    async getAll(req, res) {
        try {
            const transports = await transportService.getAll();
            res.json({
                success: true,
                data: transports,
                count: transports.length
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message
            });
        }
    }

    async create(req, res) {
        try {
            const { vehicle_type_id, status } = req.body;

            if (!vehicle_type_id) {
                return res.status(400).json({
                    success: false,
                    error: 'vehicle_type_id is required'
                });
            }

            const transport = await transportService.create({
                vehicle_type_id,
                status: status || 'PLANNED'
            });

            res.status(201).json({
                success: true,
                data: transport,
                message: 'Transport created successfully'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message
            });
        }
    }

    async getById(req, res) {
        try {
            const transport = await transportService.getById(req.params.id);
            res.json({
                success: true,
                data: transport
            });
        } catch (err) {
            if (err.message === 'Transport not found') {
                return res.status(404).json({
                    success: false,
                    error: err.message
                });
            }
            res.status(500).json({
                success: false,
                error: err.message
            });
        }
    }
}

module.exports = new TransportController();
