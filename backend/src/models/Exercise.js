const mongoose = require('mongoose');

/**
 * Exercise schema represents an individual exercise within the system.
 * Each exercise is categorized by type and difficulty and may include
 * demonstration videos. The `createdBy` field references the user
 * (trainer or administrator) who created the exercise.
 */
const ExerciseSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['cardio', 'fuerza', 'movilidad'],
      required: true,
    },
    description: { type: String, default: '' },
    duration: { type: Number, min: 0 },
    difficulty: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
    },
    videos: { type: [String], default: [] },
    createdBy: { type: Number, required: true },
  },
  {
    _id: false,
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

module.exports = mongoose.model('Exercise', ExerciseSchema);