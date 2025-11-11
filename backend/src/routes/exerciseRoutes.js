const express = require('express');
const exerciseController = require('../controllers/exerciseController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// List exercises (accessible to all authenticated users)
router.get('/', authenticateToken, exerciseController.listExercises);

// Create a new exercise (only trainers or admins)
router.post('/', authenticateToken, authorizeRoles('trainer', 'admin'), exerciseController.createExercise);

// Update an exercise
router.put('/:id', authenticateToken, authorizeRoles('trainer', 'admin'), exerciseController.updateExercise);

// Delete an exercise
router.delete('/:id', authenticateToken, authorizeRoles('trainer', 'admin'), exerciseController.deleteExercise);

module.exports = router;