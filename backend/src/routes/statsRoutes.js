const express = require('express');
const statsController = require('../controllers/statsController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get user statistics
router.get('/users/:userId', authenticateToken, authorizeRoles('student', 'colaborador', 'trainer', 'admin'), statsController.getUserStats);

// Get instructor statistics
router.get('/instructors/:instructorId', authenticateToken, authorizeRoles('trainer', 'admin'), statsController.getInstructorStats);

module.exports = router;