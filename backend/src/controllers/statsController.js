const db = require('../db/postgres');

/**
 * Fetch monthly statistics for a given user. Returns counts of routines started
 * and follow-ups performed per month. The `month_year` is returned as a
 * YYYY-MM format string.
 */
exports.getUserStats = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const result = await db.query(
      `SELECT month_year, routines_started, followups_count
       FROM gym_app.user_monthly_stats
       WHERE user_id = $1
       ORDER BY month_year`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener estadísticas de usuario', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Fetch monthly statistics for an instructor. Returns number of new assignments
 * and follow-ups performed by the instructor.
 */
exports.getInstructorStats = async (req, res) => {
  try {
    const instructorId = parseInt(req.params.instructorId, 10);
    const result = await db.query(
      `SELECT month_year, new_assignments, followups_count
       FROM gym_app.instructor_monthly_stats
       WHERE instructor_id = $1
       ORDER BY month_year`,
      [instructorId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener estadísticas de instructor', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};