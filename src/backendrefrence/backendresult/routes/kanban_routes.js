
const express = require('express');
const router = express.Router();
const { decodeTokenHT } = require('../../config/encrypts');
const kanbanController = require('../controllers/kanban_controller');

// Kanban board operations
router.get('/project/:projectId/board', decodeTokenHT, kanbanController.getBoard);
router.post('/task/:taskId/move', decodeTokenHT, kanbanController.moveTask);
router.put('/project/:projectId/config', decodeTokenHT, kanbanController.updateBoardConfig);
router.get('/project/:projectId/analytics', decodeTokenHT, kanbanController.getBoardAnalytics);

module.exports = router;
