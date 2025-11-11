const Routine = require('../models/Routine');
const Exercise = require('../models/Exercise');

/**
 * List routines. Students should see their own routines; trainers and admins can
 * filter by userId or view all. Use query parameters to filter by userId or
 * predefined status.
 */
exports.listRoutines = async (req, res) => {
  try {
    const filter = {};
    // Students see only their routines
    if (req.user.role === 'student' || req.user.role === 'colaborador') {
      filter.userId = req.user.id;
    } else if (req.query.userId) {
      filter.userId = parseInt(req.query.userId, 10);
    }
    if (req.query.predefined) {
      filter.isPredefined = req.query.predefined === 'true';
    }
    const routines = await Routine.find(filter).populate('exercises.exerciseId').lean();
    res.json(routines);
  } catch (err) {
    console.error('Error al listar rutinas', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Create a routine. Users create their own routines; trainers can create
 * predefined routines for general use by setting isPredefined=true and userId
 * to 0 (no owner). Validate referenced exercises exist.
 */
exports.createRoutine = async (req, res) => {
  try {
    const { name, description, exercises, isPredefined } = req.body;
    // Validate exercise IDs and input values
    for (const item of exercises) {
      // Ensure exerciseId is provided and a valid Mongo ObjectId
      if (!item.exerciseId || typeof item.exerciseId !== 'string') {
        return res.status(400).json({ message: 'exerciseId inválido en rutina' });
      }
      try {
        // eslint-disable-next-line no-await-in-loop
        const exists = await Exercise.findById(item.exerciseId);
        if (!exists) {
          return res.status(400).json({ message: `Ejercicio no encontrado: ${item.exerciseId}` });
        }
      } catch (ex) {
        return res.status(400).json({ message: `ID de ejercicio inválido: ${item.exerciseId}` });
      }
      // Validate numeric fields are numbers >= 0
      const numericFields = ['order', 'sets', 'reps', 'duration', 'rest'];
      for (const field of numericFields) {
        const value = item[field];
        if (typeof value !== 'number' || Number.isNaN(value) || value < 0) {
          return res.status(400).json({ message: `Valor inválido para ${field} en rutina` });
        }
      }
    }
    const routine = new Routine({
      userId: isPredefined ? 0 : req.user.id,
      name,
      description,
      exercises,
      isPredefined: !!isPredefined,
      createdBy: req.user.id,
    });
    await routine.save();
    res.status(201).json(routine);
  } catch (err) {
    console.error('Error al crear rutina', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Adopt a predefined routine. Creates a copy of the existing routine with the
 * current user as the owner. Allows modifications later.
 */
exports.adoptRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    const predefined = await Routine.findById(id);
    if (!predefined || !predefined.isPredefined) {
      return res.status(404).json({ message: 'Rutina prediseñada no encontrada' });
    }
    const copy = new Routine({
      userId: req.user.id,
      name: predefined.name,
      description: predefined.description,
      exercises: predefined.exercises,
      isPredefined: false,
      adoptedFrom: predefined._id,
      createdBy: req.user.id,
    });
    await copy.save();
    res.status(201).json(copy);
  } catch (err) {
    console.error('Error al adoptar rutina', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};