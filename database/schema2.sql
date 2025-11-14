-- =========================================================
--  SCHEMA LIMPIO Y FUNCIONAL PARA GYM_APP
-- =========================================================

DROP SCHEMA IF EXISTS gym_app CASCADE;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'gym_user') THEN
    CREATE ROLE gym_user LOGIN PASSWORD 'changeme';
  END IF;
END $$;

CREATE SCHEMA IF NOT EXISTS gym_app;
GRANT USAGE ON SCHEMA gym_app TO gym_user;

SET search_path TO gym_app;

-- =========================================================
--  app_user
-- =========================================================

CREATE TABLE IF NOT EXISTS app_user (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('student','colaborador','trainer','admin'))
);

-- =========================================================
--  assignment
-- =========================================================

CREATE TABLE IF NOT EXISTS assignment (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  instructor_id INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE
);

CREATE UNIQUE INDEX IF NOT EXISTS unique_active_assignment
ON assignment (user_id)
WHERE end_date IS NULL;

-- =========================================================
--  user stats
-- =========================================================

CREATE TABLE IF NOT EXISTS user_monthly_stats (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  month_year DATE NOT NULL,
  routines_started INTEGER NOT NULL DEFAULT 0,
  followups_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE (user_id, month_year)
);

-- =========================================================
--  instructor stats
-- =========================================================

CREATE TABLE IF NOT EXISTS instructor_monthly_stats (
  id SERIAL PRIMARY KEY,
  instructor_id INTEGER NOT NULL,
  month_year DATE NOT NULL,
  new_assignments INTEGER NOT NULL DEFAULT 0,
  followups_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE (instructor_id, month_year)
);

-- =========================================================
--  Permisos
-- =========================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA gym_app TO gym_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA gym_app TO gym_user;

-- =========================================================
--  DATOS DUMMY CON BCRYPT HASH
-- =========================================================

-- Hash bcrypt de "admin123"
-- $2b$10$uX9T4u5Qp/VgC2c1YxRz0uyT0T1La3A9NlSwiqT9u1sGHxxI6NEdK

INSERT INTO app_user (username, password_hash, role)
VALUES
  ('admin1',       '$2b$10$uX9T4u5Qp/VgC2c1YxRz0uyT0T1La3A9NlSwiqT9u1sGHxxI6NEdK', 'admin'),
  ('estudiante1',  '$2b$10$uX9T4u5Qp/VgC2c1YxRz0uyT0T1La3A9NlSwiqT9u1sGHxxI6NEdK', 'student'),
  ('estudiante2',  '$2b$10$uX9T4u5Qp/VgC2c1YxRz0uyT0T1La3A9NlSwiqT9u1sGHxxI6NEdK', 'student'),
  ('colaborador1', '$2b$10$uX9T4u5Qp/VgC2c1YxRz0uyT0T1La3A9NlSwiqT9u1sGHxxI6NEdK', 'colaborador'),
  ('trainer1',     '$2b$10$uX9T4u5Qp/VgC2c1YxRz0uyT0T1La3A9NlSwiqT9u1sGHxxI6NEdK', 'trainer'),
  ('trainer2',     '$2b$10$uX9T4u5Qp/VgC2c1YxRz0uyT0T1La3A9NlSwiqT9u1sGHxxI6NEdK', 'trainer')
ON CONFLICT (username) DO NOTHING;

INSERT INTO assignment (user_id, instructor_id, start_date, end_date)
VALUES
  (2, 5, CURRENT_DATE - INTERVAL '10 days', NULL),
  (3, 6, CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '5 days')
ON CONFLICT DO NOTHING;
