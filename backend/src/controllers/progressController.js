const ProgressLog = require('../models/ProgressLog');
const Routine = require('../models/Routine');

/**
 * Create a progress log entry for a routine. Validates that the routine
 * belongs to the user or that the trainer is assigned to the user (assignment
 * logic is stored in PostgreSQL). For simplicity we just check ownership here.
 */
exports.createProgressLog = async (req, res) => {
  try {
    const { routineId, exerciseId, repetitions, duration, effortLevel, comments } = req.body;
    // Validate that the routine exists
    const routine = await Routine.findById(routineId);
    if (!routine) {
      return res.status(404).json({ message: 'Rutina no encontrada' });
    }
    // Only owner can log progress
    if (routine.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para registrar progreso en esta rutina' });
    }
    const log = new ProgressLog({
      routineId,
      userId: req.user.id,
      date: new Date(),
      exerciseId,
      repetitions,
      duration,
      effortLevel,
      comments,
    });
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    console.error('Error al registrar progreso', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * List progress logs for a specific routine or user. Students see their own logs;
 * trainers and admins can filter by user ID.
 */
exports.listProgressLogs = async (req, res) => {
  try {
    const filter = {};
    if (req.query.routineId) {
      filter.routineId = req.query.routineId;
    }
    if (req.user.role === 'student' || req.user.role === 'colaborador') {
      filter.userId = req.user.id;
    } else if (req.query.userId) {
      filter.userId = parseInt(req.query.userId, 10);
    }
    const logs = await ProgressLog.find(filter).populate('exerciseId').lean();
    res.json(logs);
  } catch (err) {
    console.error('Error al listar registros de progreso', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};