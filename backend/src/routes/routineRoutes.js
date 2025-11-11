const express = require('express');
const routineController = require('../controllers/routineController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// List routines (authenticated)
router.get('/', authenticateToken, routineController.listRoutines);

// Create routine (students, collaborators, trainers)
router.post('/', authenticateToken, authorizeRoles('student', 'colaborador', 'trainer', 'admin'), routineController.createRoutine);

// Adopt predefined routine
router.post('/:id/adopt', authenticateToken, authorizeRoles('student', 'colaborador'), routineController.adoptRoutine);

module.exports = router;