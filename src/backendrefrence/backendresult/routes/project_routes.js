
const express = require('express');
const router = express.Router();
const { decodeTokenHT } = require('../../config/encrypts');
const projectController = require('../controllers/project_controller');

// Project CRUD operations
router.get('/', decodeTokenHT, projectController.getProjects);
router.post('/', decodeTokenHT, projectController.createProject);
router.get('/:id', decodeTokenHT, projectController.getProjectDetail);
router.put('/:id', decodeTokenHT, projectController.updateProject);
router.delete('/:id', decodeTokenHT, projectController.deleteProject);

// Kanban and Gantt data
router.get('/:id/kanban', decodeTokenHT, projectController.getKanbanData);
router.get('/:id/gantt', decodeTokenHT, projectController.getGanttData);

module.exports = router;
