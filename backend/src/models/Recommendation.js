const mongoose = require('mongoose');

/**
 * Recommendation schema stores personalized messages or advice from a trainer
 * to a user. This allows trainers to provide targeted feedback based on
 * progress. References the user and trainer IDs from the relational DB.
 */
const RecommendationSchema = new mongoose.Schema(
  {
    trainerId: { type: Number, required: true },
    userId: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recommendation', RecommendationSchema);