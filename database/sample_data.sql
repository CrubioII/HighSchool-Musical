-- Datos de ejemplo para la base de datos PostgreSQL del sistema de gimnasio.
-- Este script pobla las tablas del esquema gym_app con usuarios de prueba,
-- asignaciones y estadísticas mensuales para que la aplicación sea
-- completamente funcional sin necesidad de crear datos manualmente.

BEGIN;

-- Usuarios de la aplicación (id, username, password_hash, role)
-- Todos los usuarios tienen la contraseña 'admin123' hash bcrypt.
INSERT INTO gym_app.app_user (id, username, password_hash, role) VALUES
  (1, 'admin', '$2a$10$O7.B9G46wAK4sH/xdyfbSOAhkTNBUPgW6au7nmnz5qOuZ.MijHTvm', 'admin'),
  (2, 'estudiante1', '$2a$10$O7.B9G46wAK4sH/xdyfbSOAhkTNBUPgW6au7nmnz5qOuZ.MijHTvm', 'student'),
  (3, 'colaborador1', '$2a$10$O7.B9G46wAK4sH/xdyfbSOAhkTNBUPgW6au7nmnz5qOuZ.MijHTvm', 'colaborador'),
  (4, 'trainer1', '$2a$10$O7.B9G46wAK4sH/xdyfbSOAhkTNBUPgW6au7nmnz5qOuZ.MijHTvm', 'trainer')
ON CONFLICT (id) DO NOTHING;

-- Asignar entrenador (trainer1) a estudiante1
INSERT INTO gym_app.assignment (user_id, instructor_id, start_date)
VALUES (2, 4, CURRENT_DATE)
ON CONFLICT (id) DO NOTHING;

-- Estadísticas mensuales de usuarios (user_monthly_stats)
-- month_year usa día 1 de cada mes para simplificar
INSERT INTO gym_app.user_monthly_stats (user_id, month_year, routines_started, followups_count)
VALUES
  (2, DATE '2025-01-01', 2, 4),
  (2, DATE '2025-02-01', 3, 5),
  (3, DATE '2025-01-01', 1, 2)
ON CONFLICT (user_id, month_year) DO NOTHING;

-- Estadísticas mensuales de instructores (instructor_monthly_stats)
INSERT INTO gym_app.instructor_monthly_stats (instructor_id, month_year, new_assignments, followups_count)
VALUES
  (4, DATE '2025-01-01', 1, 6),
  (4, DATE '2025-02-01', 2, 8)
ON CONFLICT (instructor_id, month_year) DO NOTHING;

COMMIT;