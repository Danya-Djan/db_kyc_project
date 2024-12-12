CREATE TABLE IF NOT EXISTS clicks(
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    time TIMESTAMP,
    value DECIMAL(100, 2),
    expiry_info JSONB
);
CREATE INDEX IF NOT EXISTS clicks_user_id_time_idx ON clicks(user_id, time);
