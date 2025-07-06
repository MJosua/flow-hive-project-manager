const express = require('express');
const route = express.Router();
const { decodeTokenHT } = require('../../config/encrypts');
const project_controller = require('../../controller/project_manager_controller/project_controller');


// Task routes
route.get('/', decodeTokenHT, project_controller.getAllProjects);
route.get('/detail/:id', decodeTokenHT, project_controller.getProjectDetail);
route.post('/', decodeTokenHT, project_controller.createProject);
route.patch('/:id', decodeTokenHT, project_controller.updateProject);
route.delete('/:id', decodeTokenHT, project_controller.deleteProject);

module.exports = route;
