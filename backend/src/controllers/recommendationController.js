const Recommendation = require('../models/Recommendation');

/**
 * Create a new recommendation from a trainer to a user. Only trainers and
 * administrators should be allowed to create recommendations. The
 * recommendation will store trainerId (from JWT), userId and content.
 */
exports.createRecommendation = async (req, res) => {
  try {
    const { userId, content } = req.body;
    if (!userId || !content) {
      return res.status(400).json({ message: 'userId y content son obligatorios' });
    }
    const rec = new Recommendation({
      trainerId: req.user.id,
      userId: Number(userId),
      content,
      date: new Date(),
    });
    await rec.save();
    res.status(201).json(rec);
  } catch (err) {
    console.error('Error al crear recomendación', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * List recommendations for a specific user (students/collaborators) or trainer.
 * Users see recommendations addressed to them. Trainers and admins can list
 * recommendations they have authored by specifying ?trainerId in query.
 */
exports.listRecommendations = async (req, res) => {
  try {
    const filter = {};
    // Students or collaborators see their own recommendations
    if (req.user.role === 'student' || req.user.role === 'colaborador') {
      filter.userId = req.user.id;
    }
    // Trainers/admins may filter by trainerId or userId via query
    if (req.query.userId) {
      filter.userId = Number(req.query.userId);
    }
    if (req.query.trainerId) {
      filter.trainerId = Number(req.query.trainerId);
    }
    const recs = await Recommendation.find(filter).sort({ date: -1 }).lean();
    res.json(recs);
  } catch (err) {
    console.error('Error al listar recomendaciones', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};