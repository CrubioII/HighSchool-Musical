const express = require('express');
const progressController = require('../controllers/progressController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// List progress logs
router.get('/', authenticateToken, progressController.listProgressLogs);

// Create progress log (only student or collaborator)
router.post('/', authenticateToken, authorizeRoles('student', 'colaborador'), progressController.createProgressLog);

module.exports = router;