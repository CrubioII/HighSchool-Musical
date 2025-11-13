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
      const difficultyFilter = Number(req.query.difficulty);
      if (!Number.isNaN(difficultyFilter)) {
        filter.difficulty = difficultyFilter;
      }
    }
    const exercises = await Exercise.find(filter).sort({ id: 1 }).lean();
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
    const { name, type, description, duration, difficulty, videos, id: externalId } = req.body;

    if (typeof difficulty !== 'number' || Number.isNaN(difficulty)) {
      return res.status(400).json({ message: 'La dificultad debe ser numérica' });
    }

    const normalizedVideos = Array.isArray(videos)
      ? videos.filter((url) => typeof url === 'string' && url.trim().length > 0)
      : [];

    const payload = {
      name,
      type,
      description: description || '',
      difficulty,
      createdBy: req.user.id,
    };

    if (duration !== undefined) {
      const numericDuration = Number(duration);
      if (!Number.isNaN(numericDuration)) {
        payload.duration = numericDuration;
      }
    }
    if (normalizedVideos.length > 0) {
      payload.videos = normalizedVideos;
    }

    if (externalId !== undefined) {
      const numericId = Number(externalId);
      if (Number.isNaN(numericId)) {
        return res.status(400).json({ message: 'El id proporcionado no es numérico' });
      }
      payload.id = numericId;
    } else {
      const lastExercise = await Exercise.findOne().sort({ id: -1 }).lean();
      payload.id = lastExercise ? lastExercise.id + 1 : 1;
    }

    const exercise = await Exercise.create(payload);
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
    const exerciseId = Number(req.params.id);
    if (Number.isNaN(exerciseId)) {
      return res.status(400).json({ message: 'Identificador inválido' });
    }

    const allowedFields = ['name', 'type', 'description', 'difficulty', 'duration', 'videos'];
    const update = {};

    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        update[field] = req.body[field];
      }
    });

    if (update.difficulty !== undefined) {
      const numericDifficulty = Number(update.difficulty);
      if (Number.isNaN(numericDifficulty)) {
        return res.status(400).json({ message: 'La dificultad debe ser numérica' });
      }
      update.difficulty = numericDifficulty;
    }

    if (update.duration !== undefined) {
      const numericDuration = Number(update.duration);
      if (Number.isNaN(numericDuration)) {
        delete update.duration;
      } else {
        update.duration = numericDuration;
      }
    }

    if (update.videos !== undefined) {
      update.videos = Array.isArray(update.videos)
        ? update.videos.filter((url) => typeof url === 'string' && url.trim().length > 0)
        : [];
    }

    const exercise = await Exercise.findOneAndUpdate({ id: exerciseId }, update, {
      new: true,
      runValidators: true,
    });

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
    const exerciseId = Number(req.params.id);
    if (Number.isNaN(exerciseId)) {
      return res.status(400).json({ message: 'Identificador inválido' });
    }

    const exercise = await Exercise.findOneAndDelete({ id: exerciseId });
    if (!exercise) {
      return res.status(404).json({ message: 'Ejercicio no encontrado' });
    }
    res.status(204).end();
  } catch (err) {
    console.error('Error al eliminar ejercicio', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};