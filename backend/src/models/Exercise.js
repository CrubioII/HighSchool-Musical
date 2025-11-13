const mongoose = require('mongoose');

/**
 * Exercise schema represents an individual exercise within the system.
 * Each exercise is categorized by type and difficulty and may include
 * demonstration videos. The `createdBy` field references the user
 * (trainer or administrator) who created the exercise.
 */
const ExerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['cardio', 'fuerza', 'movilidad'],
      required: true,
    },
    description: { type: String, default: '' },
    duration: { type: Number, required: true, min: 1 }, // Duration in minutes
    difficulty: {
      type: String,
      enum: ['principiante', 'intermedio', 'avanzado'],
      required: true,
    },
    videos: [{ type: String, default: [] }],
    createdBy: { type: Number, required: true }, // references user_id from relational DB
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exercise', ExerciseSchema);