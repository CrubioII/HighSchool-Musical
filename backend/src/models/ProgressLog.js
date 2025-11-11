const mongoose = require('mongoose');

/**
 * ProgressLog schema stores an entry of the user's progress within a routine.
 * Each log references a routine and exercise, capturing performance metrics
 * like repetitions, duration, and perceived effort. Additional comments can
 * record subjective feedback or trainer notes.
 */
const ProgressLogSchema = new mongoose.Schema(
  {
    routineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Routine', required: true },
    userId: { type: Number, required: true },
    date: { type: Date, required: true },
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
    repetitions: { type: Number, default: 0 },
    duration: { type: Number, default: 0 }, // time in minutes
    effortLevel: { type: String, enum: ['bajo', 'medio', 'alto'], default: 'medio' },
    comments: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProgressLog', ProgressLogSchema);