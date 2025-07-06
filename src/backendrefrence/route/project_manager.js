/**
 * @swagger
 * /order/get_id:
 *   post:
 *     summary: Get Order with specific ID
 *     description: Get Order with specific ID
 *     tags:
 *       - E-Order
 *     parameters:
 *       - in: query
 *         name: API_Shortener
 *         required: true
 *         schema:
 *           type: string
 *         description: The input field for the query
 *     responses:
 *       200:
 *         description: Result is the shortened URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortenedUrl:
 *                   type: string
 *                   description: The shortened version of the URL
 *                   example: https://short.ly/abc123
 */

const express = require('express')
const route = express.Router();
const { readToken } = require('../../config/encrypts');
const { projectmngr_project } = require('../../controller');
const { decodeTokenHT } = require('../../config/encrypts')




// Projects
route.get('/', decodeTokenHT, projectmngr_project.getProjects)
route.post('/', decodeTokenHT, projectmngr_project.createProject)
route.get('/:id', decodeTokenHT, projectmngr_project.getProjectDetail)
route.put('/:id', decodeTokenHT, projectmngr_project.updateProject)
route.delete('/:id', decodeTokenHT, projectmngr_project.deleteProject)

// Project Members
route.get('/:id/members', decodeTokenHT, projectmngr_project.getProjectMembers)
route.post('/:id/members', decodeTokenHT, projectmngr_project.addProjectMember)
route.put('/:id/members/:userId', decodeTokenHT, projectmngr_project.updateProjectMember)
route.delete('/:id/members/:userId', decodeTokenHT, projectmngr_project.removeProjectMember)

// Task Groups (NEW)
route.get('/:id/groups', decodeTokenHT, projectmngr_project.getTaskGroups)
route.post('/:id/groups', decodeTokenHT, projectmngr_project.createTaskGroup)
route.put('/:id/groups/:groupId', decodeTokenHT, projectmngr_project.updateTaskGroup)
route.delete('/:id/groups/:groupId', decodeTokenHT, projectmngr_project.deleteTaskGroup)

// Project Tasks
route.get('/:id/tasks', decodeTokenHT, projectmngr_project.getProjectTasks)
route.get('/:id/kanban', decodeTokenHT, projectmngr_project.getKanbanData)
route.get('/:id/gantt', decodeTokenHT, projectmngr_project.getGanttData)

// Project Chat
route.get('/:id/messages', decodeTokenHT, projectmngr_project.getChatMessages)
route.post('/:id/messages', decodeTokenHT, projectmngr_project.sendMessage)

module.exports = route
