const db = require('../db/postgres');

/**
 * Assign or reassign a trainer to a user. If an assignment exists, we close
 * the previous assignment by setting its end_date and insert a new one.
 */
exports.assignTrainer = async (req, res) => {
  try {
    const { userId, instructorId } = req.body;
    if (!userId || !instructorId) {
      return res.status(400).json({ message: 'userId e instructorId son obligatorios' });
    }
    // Close any existing assignment
    await db.query(
      `UPDATE gym_app.assignment SET end_date = CURRENT_DATE WHERE user_id = $1 AND end_date IS NULL`,
      [userId]
    );
    // Insert new assignment
    await db.query(
      `INSERT INTO gym_app.assignment (user_id, instructor_id, start_date) VALUES ($1, $2, CURRENT_DATE)`,
      [userId, instructorId]
    );
    res.json({ message: 'Entrenador asignado exitosamente' });
  } catch (err) {
    console.error('Error al asignar entrenador', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};