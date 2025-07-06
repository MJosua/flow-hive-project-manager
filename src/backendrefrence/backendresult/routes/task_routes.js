
const express = require('express');
const router = express.Router();
const { decodeTokenHT } = require('../../config/encrypts');
const taskController = require('../controllers/task_controller');

// Task CRUD operations
router.get('/', decodeTokenHT, taskController.getAllTasks);
router.get('/my-tasks', decodeTokenHT, taskController.getMyTasks);
router.post('/', decodeTokenHT, taskController.createTask);
router.patch('/:id/status', decodeTokenHT, taskController.updateTaskStatus);
router.patch('/:id/move-group', decodeTokenHT, taskController.moveTaskToGroup);

// Task dependencies
router.get('/:id/dependencies', decodeTokenHT, taskController.getTaskDependencies);
router.post('/:id/dependencies', decodeTokenHT, taskController.addTaskDependency);

// Time tracking
router.get('/:id/time-entries', decodeTokenHT, taskController.getTimeEntries);
router.post('/:id/time-entries', decodeTokenHT, taskController.logTime);

module.exports = router;
