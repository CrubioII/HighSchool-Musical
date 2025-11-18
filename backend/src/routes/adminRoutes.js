const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Assign trainer to user (admin only)
router.post('/assign', authenticateToken, authorizeRoles('admin'), adminController.assignTrainer);

// List active assignments for the authenticated trainer or admin
router.get(
  '/assignments',
  authenticateToken,
  authorizeRoles('trainer', 'admin'),
  adminController.listTrainerAssignments
);

module.exports = router;
