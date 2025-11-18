const db = require('../db/postgres');
const Routine = require('../models/Routine');
const statsService = require('../services/statsService');

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
    await statsService.recordNewAssignment(instructorId, new Date());
    res.json({ message: 'Entrenador asignado exitosamente' });
  } catch (err) {
    console.error('Error al asignar entrenador', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Return active assignments for the authenticated trainer. It joins PostgreSQL
 * data (assignments + usernames) with MongoDB to fetch the latest routine for
 * each assigned user.
 */
exports.listTrainerAssignments = async (req, res) => {
  try {
    const trainerId = req.user.id;

    const assignmentsResult = await db.query(
      `SELECT a.id, a.user_id, u.username AS user_name, a.start_date
       FROM gym_app.assignment a
       JOIN gym_app.app_user u ON u.id = a.user_id
       WHERE a.instructor_id = $1 AND a.end_date IS NULL
       ORDER BY a.start_date DESC`,
      [trainerId]
    );

    const userIds = assignmentsResult.rows.map((row) => row.user_id);
    const routines = userIds.length
      ? await Routine.aggregate([
          { $match: { userId: { $in: userIds } } },
          { $sort: { updatedAt: -1 } },
          {
            $group: {
              _id: '$userId',
              latestRoutine: { $first: '$$ROOT' },
            },
          },
        ])
      : [];

    const routinesMap = routines.reduce((acc, item) => {
      acc[item._id] = item.latestRoutine;
      return acc;
    }, {});

    const payload = assignmentsResult.rows.map((row) => {
      const routine = routinesMap[row.user_id];
      return {
        id: row.id,
        name: row.user_name,
        program: routine ? routine.name : 'Sin programa asignado',
        lastUpdate: routine ? routine.updatedAt : null,
      };
    });

    res.json(payload);
  } catch (err) {
    console.error('Error al listar asignaciones activas', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
