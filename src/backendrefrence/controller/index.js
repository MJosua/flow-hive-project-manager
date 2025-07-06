const authController = require('./auth');
const authTmController = require('./authTM');
const cartController = require('./cart');
const userController = require('./user');
const orderController = require('./order');
const eventController = require('./event');
const productController = require('./product');
const adminController = require('./admin');
const spectatorController = require('./spectator');
const trademarkController = require('./trademark')
const authControllerTest = require('./auth_test')
const productControllerTest = require('./product_test')

const cardGenerator = require('./cardGenerator')

const hotsAuth = require('./hots/hotsAuth')
const hotsAdmin = require('./hots/hotsAdmin')
const hotsTicket = require('./hots/hotsTicket')
const hotsSettingsController = require('./hots/hotsSettingsController')
const hotsTps = require('./hots/hotsTps')
const hotscustomfunctionController = require('./hots/hotscustomfunctionController')
const hotsSRFController = require('./hots/hotsSRFController');

const shortenerController = require('./shortenerController')


const srtsController = require('./srtsController')

const projectmngr_task = require('./project_manager_controller/task_controller')
const projectmngr_project = require('./project_manager_controller/project_controller')

module.exports = {
    authController,
    authTmController,
    cartController,
    userController,
    orderController,
    eventController,
    productController,
    adminController,
    spectatorController,
    trademarkController,
    authControllerTest,
    productControllerTest,
    cardGenerator,
    hotsAuth,
    hotsAdmin,
    hotsTicket,
    hotsSettingsController,
    shortenerController,
    hotsTps,
    hotscustomfunctionController,
    hotsSRFController,


    srtsController,

    projectmngr_task,
    projectmngr_project,

};