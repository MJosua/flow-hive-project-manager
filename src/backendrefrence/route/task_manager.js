const express = require('express')
const route = express.Router();
const { projectmngr_task } = require('../../controller');
const { readToken } = require('../../config/encrypts');
const { decodeTokenHT } = require('../../config/encrypts')

// Tasks
route.get('/', decodeTokenHT, projectmngr_task.getAllTasks)
route.get('/my-tasks', decodeTokenHT, projectmngr_task.getMyTasks)
route.post('/', decodeTokenHT, projectmngr_task.createTask)
route.get('/:id', decodeTokenHT, projectmngr_task.getTaskDetail)
route.put('/:id', decodeTokenHT, projectmngr_task.updateTask)
route.patch('/:id/status', decodeTokenHT, projectmngr_task.updateTaskStatus)
route.patch('/:id/move-group', decodeTokenHT, projectmngr_task.moveTaskToGroup)
route.delete('/:id', decodeTokenHT, projectmngr_task.deleteTask)

// Task Dependencies
route.get('/:id/dependencies', decodeTokenHT, projectmngr_task.getTaskDependencies)
route.post('/:id/dependencies', decodeTokenHT, projectmngr_task.addTaskDependency)
route.delete('/:id/dependencies/:depId', decodeTokenHT, projectmngr_task.removeTaskDependency)

// Time Tracking
route.get('/:id/time-entries', decodeTokenHT, projectmngr_task.getTimeEntries)
route.post('/:id/time-entries', decodeTokenHT, projectmngr_task.logTime)
route.put('/time-entries/:entryId', decodeTokenHT, projectmngr_task.updateTimeEntry)
route.delete('/time-entries/:entryId', decodeTokenHT, projectmngr_task.deleteTimeEntry)

// File Attachments
route.get('/:id/attachments', decodeTokenHT, projectmngr_task.getTaskAttachments)
route.post('/:id/attachments', decodeTokenHT, projectmngr_task.uploadAttachment)
route.delete('/attachments/:attachmentId', decodeTokenHT, projectmngr_task.deleteAttachment)

module.exports = route
