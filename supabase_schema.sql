-- SeatSeek Production Database Schema
-- Run this in your Supabase SQL Editor to set up the environment

-- 1. Trains Table
CREATE TABLE IF NOT EXISTS trains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    train_no VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    origin_code VARCHAR(10),
    destination_code VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Coach Density Table (Real-time tracking)
CREATE TABLE IF NOT EXISTS coach_density (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    train_no VARCHAR(10) REFERENCES trains(train_no),
    coach_id VARCHAR(10) NOT NULL,
    density_level VARCHAR(20) CHECK (density_level IN ('Low', 'Medium', 'High')),
    passenger_count INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Sensor Logs (IoT Integration)
CREATE TABLE IF NOT EXISTS sensor_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(50) NOT NULL,
    train_no VARCHAR(10),
    coach_id VARCHAR(10),
    entry_count INTEGER DEFAULT 0,
    exit_count INTEGER DEFAULT 0,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. User Saved Searches
CREATE TABLE IF NOT EXISTS saved_searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    train_no VARCHAR(10),
    search_query JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Real-time for density tracking
ALTER PUBLICATION supabase_realtime ADD TABLE coach_density;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_train_no ON trains(train_no);
CREATE INDEX IF NOT EXISTS idx_density_train ON coach_density(train_no);
CREATE INDEX IF NOT EXISTS idx_sensor_train ON sensor_logs(train_no);
