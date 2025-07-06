
/**
 * @swagger
 * tags:
 *   - name: E-Order
 *     description: E-Order APIs
 *   - name: Hots
 *     description: Hots APIs
 *   - name: CardManagement
 *     description: CardManagement APIs
 *   - name: TM-Management
 *     description: TradeMark APIs
 *   - name: Shortener
 *     description: Shortener for Click APIs
 *   - name: Project-Manager
 *     description: Project Manager APIs
 */

const authRouter = require('./auth')
const authTmRouter = require('./authTM')
const cartRouter = require('./cart')
const userRouter = require('./user')
const orderRouter = require('./order')
const eventRouter = require('./event')
const productRouter = require('./product')
const adminRouter = require('./admin')
const spectatorRouter = require('./spectator')
const trademarkRouter = require('./trademark')
const authRouterTest = require('./auth_test')
const productRouterTest = require('./product_test')
const cardGenerator = require('./cardGenerator')
const hotsAuth = require('./hotsAuth')
const hotsAdmin = require('./hotsAdmin')
const hotsTicket = require('./hotsTicket')
const hotsSettings = require('./hotsSettings')
const shortener = require('./shortener')
const hotsTps = require('./hotsTps')
const hotscustomfunction = require('./hotscustomfunction')

// Project Manager routes
const projectmngr = require('./project_manager/project_routes')
const taskmngr = require('./project_manager/task_routes')
const ganttmngr = require('./project_manager/gantt_routes')
const kanbanmngr = require('./project_manager/kanban_routes')
const approvalmngr = require('./project_manager/approval_routes')
const departmentmngr = require('./project_manager/department_routes')
const teammngr = require('./project_manager/team_routes')

const srtsRouter = require('./srtsRouter')

const user = require('../controller/user')

module.exports = {
    authRouter,
    authTmRouter,
    cartRouter,
    userRouter,
    orderRouter,
    productRouter,
    adminRouter,
    spectatorRouter,
    trademarkRouter,
    authRouterTest,
    productRouterTest,
    cardGenerator,
    hotsAuth,
    hotsAdmin,
    hotsTicket,
    hotsSettings,
    eventRouter,
    shortener,
    hotsTps,
    hotscustomfunction,
    srtsRouter,
    
    // Project Manager modules
    projectmngr,
    taskmngr,
    ganttmngr,
    kanbanmngr,
    approvalmngr,
    departmentmngr,
    teammngr,
} 
