const express = require('express')
const route = express.Router();
const { readToken } = require('../../config/encrypts');
const { projectmgr_user } = require('../../controller');
const { decodeTokenHT } = require('../../config/encrypts')


// Users
route.get('/', decodeTokenHT, projectmgr_user.getUsers)
route.post('/', decodeTokenHT, projectmgr_user.createUser)
route.get('/:id', decodeTokenHT, projectmgr_user.getUserDetail)
route.put('/:id', decodeTokenHT, projectmgr_user.updateUser)
route.delete('/:id', decodeTokenHT, projectmgr_user.deleteUser)

// Teams
route.get('/teams', decodeTokenHT, projectmgr_user.getTeams)
route.post('/teams', decodeTokenHT, projectmgr_user.createTeam)
route.put('/teams/:id', decodeTokenHT, projectmgr_user.updateTeam)
route.delete('/teams/:id', decodeTokenHT, projectmgr_user.deleteTeam)

// Departments
route.get('/departments', decodeTokenHT, projectmgr_user.getDepartments)
route.post('/departments', decodeTokenHT, projectmgr_user.createDepartment)
route.put('/departments/:id', decodeTokenHT, projectmgr_user.updateDepartment)
route.delete('/departments/:id', decodeTokenHT, projectmgr_user.deleteDepartment)

module.exports = route
