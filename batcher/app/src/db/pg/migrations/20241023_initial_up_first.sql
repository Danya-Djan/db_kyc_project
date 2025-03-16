CREATE TABLE users(
    id BIGINT PRIMARY KEY,
    energy INTEGER NOT NULL CONSTRAINT non_negative_energy CHECK (energy >= 0),
    session VARCHAR(255) NOT NULL
);

CREATE TABLE clicks(
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    time TIMESTAMP NOT NULL,
    value DECIMAL(100, 2) NOT NULL,
    count BIGINT NOT NULL
);
CREATE INDEX clicks_user_id_time_idx ON clicks(user_id, time);

CREATE MATERIALIZED VIEW coefficients AS
SELECT 
    user_id,
    (SELECT COUNT(*) FROM clicks AS c1 WHERE now() - time < interval '24 hours' AND c1.user_id = user_id) AS period_24, 
    (SELECT COUNT(*) FROM clicks AS c1 WHERE now() - time < interval '168 hours' AND c1.user_id = user_id) AS period_168, 
    (SELECT SUM(value * count) FROM clicks AS c1 WHERE c1.user_id = user_id) as total
FROM clicks
;

CREATE TABLE global_stat(
    id BIGINT PRIMARY KEY DEFAULT 1,
    user_count BIGINT NOT NULL,
    global_average DECIMAL(100, 2) NOT NULL,
    max_period_24 DECIMAL(100, 2) NOT NULL,
    max_period_168 DECIMAL(100, 2) NOT NULL
);

INSERT INTO global_stat (user_count, global_average, max_period_24, max_period_168) VALUES (0, 0, 0, 0);

CREATE OR REPLACE FUNCTION raise_error()
    RETURNS TRIGGER
AS $body$
BEGIN
    RAISE EXCEPTION 'No changes allowed';
    RETURN NULL;
END;
$body$
LANGUAGE PLPGSQL;

CREATE TRIGGER singleton_trg 
    BEFORE INSERT OR DELETE OR TRUNCATE ON global_stat
    FOR EACH STATEMENT EXECUTE PROCEDURE raise_error();

CREATE OR REPLACE FUNCTION handle_new_click()
    RETURNS TRIGGER
AS $body$
BEGIN
    WITH user_stats AS (
        SELECT period_24, period_168 FROM coefficients AS c WHERE c.user_id=new.user_id
    )
    UPDATE global_stat AS gs SET
        global_average=(gs.global_average * gs.user_count + new.value * new.count) / gs.user_count,
        max_period_24=GREATEST(us.period_24, gs.max_period_24),
        max_period_168=GREATEST(us.period_168, gs.max_period_168)
    FROM user_stats AS us
    ;
    RETURN NULL;
END;
$body$
LANGUAGE PLPGSQL;

CREATE TRIGGER new_click_trg
    AFTER INSERT ON clicks
    FOR EACH ROW EXECUTE PROCEDURE handle_new_click();

CREATE OR REPLACE FUNCTION handle_new_user()
    RETURNS TRIGGER
AS $body$
BEGIN
    UPDATE global_stat SET
        global_average=global_average * user_count / (user_count + 1),
        user_count=user_count + 1
    ;
    RETURN NULL;
END;
$body$
LANGUAGE PLPGSQL;

CREATE TRIGGER new_user_trg
    AFTER INSERT ON users
    FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

CREATE OR REPLACE FUNCTION handle_user_deletion()
    RETURNS TRIGGER
AS $body$
BEGIN
    UPDATE global_stat SET
        global_average=global_average * user_count / (user_count - 1),
        user_count=user_count - 1
    ;
END;
$body$
LANGUAGE PLPGSQL;

CREATE TRIGGER delete_user_trg
    AFTER DELETE ON users
    FOR EACH ROW EXECUTE PROCEDURE handle_user_deletion();

CREATE OR REPLACE FUNCTION handle_user_truncate()
    RETURNS TRIGGER
AS $body$
BEGIN
    UPDATE global_stat SET
        global_average=0,
        user_count=0
    ;
    RETURN NULL;
END;
$body$
LANGUAGE PLPGSQL;

CREATE TRIGGER truncate_user_trg
    AFTER TRUNCATE ON users
    FOR STATEMENT EXECUTE PROCEDURE handle_user_truncate();

