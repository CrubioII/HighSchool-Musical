const mongoose = require('mongoose');

/**
 * Routine schema represents a workout plan composed of multiple exercises.
 * It stores references to exercises and metadata about the order and parameters
 * (such as repetitions or duration) for each exercise. A routine can be
 * predefined by a trainer (isPredefined=true) or customized by a user. Users
 * can adopt predefined routines and modify their own copies.
 */
const RoutineSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    exercises: [
      {
        exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
        order: { type: Number, required: true },
        sets: { type: Number, default: 0 },
        reps: { type: Number, default: 0 },
        duration: { type: Number, default: 0 },
        rest: { type: Number, default: 0 },
      },
    ],
    isPredefined: { type: Boolean, default: false },
    adoptedFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Routine', default: null },
    createdBy: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Routine', RoutineSchema);