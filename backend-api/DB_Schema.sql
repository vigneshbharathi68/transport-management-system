-- Vehicle Type (First - due to FK dependency)
CREATE TABLE vehicle_type (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capacity_weight DECIMAL(10,2) NOT NULL,  -- kg
    capacity_volume DECIMAL(10,2) NOT NULL,   -- m³ or CFT
    max_quantity INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_vehicle_type_name (name)
);

-- Material
CREATE TABLE material (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    unit_weight DECIMAL(8,2),  -- kg per unit
    unit_volume DECIMAL(8,2),  -- Cubic Feet per unit
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transport
CREATE TABLE transport (
    id BIGSERIAL PRIMARY KEY,
    vehicle_type_id BIGINT NOT NULL REFERENCES vehicle_type(id),
    status VARCHAR(20) DEFAULT 'PLANNED' 
        CHECK (status IN ('PLANNED','ACTIVE','COMPLETED','CANCELLED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipment (Last - depends on all above)
CREATE TABLE shipment (
    id BIGSERIAL PRIMARY KEY,
    order_no VARCHAR(100) UNIQUE NOT NULL,
    group_id VARCHAR(100),
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    material_id BIGINT NOT NULL REFERENCES material(id),  -- Fixed: id, not code
    vehicle_type_id BIGINT NOT NULL REFERENCES vehicle_type(id),
    weight DECIMAL(10,2) NOT NULL,
    volume DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAFT' 
        CHECK (status IN ('DRAFT','SCHEDULED','IN_TRANSIT','DELIVERED','CANCELLED')),
    estimated_delivery DATE,
    actual_delivery DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes AFTER table creation (PostgreSQL requirement)
CREATE INDEX idx_transport_status ON transport(status);
CREATE INDEX idx_transport_vehicle_type ON transport(vehicle_type_id);
CREATE INDEX idx_material_code ON material(code);
CREATE INDEX idx_shipment_status ON shipment(status);
CREATE INDEX idx_shipment_group_id ON shipment(group_id);
CREATE INDEX idx_shipment_order_no ON shipment(order_no);
