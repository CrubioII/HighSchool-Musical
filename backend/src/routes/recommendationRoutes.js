const express = require('express');
const recommendationController = require('../controllers/recommendationController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Create recommendation (trainer or admin)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('trainer', 'admin'),
  recommendationController.createRecommendation,
);

// List recommendations
router.get(
  '/',
  authenticateToken,
  authorizeRoles('student', 'colaborador', 'trainer', 'admin'),
  recommendationController.listRecommendations,
);

module.exports = router;