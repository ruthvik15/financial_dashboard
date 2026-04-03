CREATE TABLE records (
    id SERIAL PRIMARY KEY,
    amount NUMERIC(12, 2) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'expense')),
    category VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

