const Exercise = require('../models/Exercise');

/**
 * Get all exercises. Allows optional query parameters to filter by type or
 * difficulty.
 */
exports.listExercises = async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) {
      filter.type = req.query.type;
    }
    if (req.query.difficulty) {
      filter.difficulty = req.query.difficulty;
    }
    const exercises = await Exercise.find(filter).lean();
    res.json(exercises);
  } catch (err) {
    console.error('Error al listar ejercicios', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Create a new exercise. Only trainers or administrators should be allowed.
 * Uses the authenticated user id as the creator.
 */
exports.createExercise = async (req, res) => {
  try {
    const { name, type, description, duration, difficulty, videos } = req.body;
    const exercise = new Exercise({
      name,
      type,
      description,
      duration,
      difficulty,
      videos,
      createdBy: req.user.id,
    });
    await exercise.save();
    res.status(201).json(exercise);
  } catch (err) {
    console.error('Error al crear ejercicio', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Update an existing exercise. Only trainers or administrators should be
 * permitted. If the exercise does not exist, returns 404.
 */
exports.updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const exercise = await Exercise.findByIdAndUpdate(id, update, { new: true });
    if (!exercise) {
      return res.status(404).json({ message: 'Ejercicio no encontrado' });
    }
    res.json(exercise);
  } catch (err) {
    console.error('Error al actualizar ejercicio', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Delete an exercise. Only allowed for trainers or administrators. If the
 * exercise does not exist returns 404.
 */
exports.deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findByIdAndDelete(id);
    if (!exercise) {
      return res.status(404).json({ message: 'Ejercicio no encontrado' });
    }
    res.status(204).end();
  } catch (err) {
    console.error('Error al eliminar ejercicio', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};