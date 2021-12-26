const adminRouter = require('express').Router()
const adminController = require('../controllers/adminControler')
const authMiddleware = require('../middlewares/authentication')
const notFound = require('./404')

adminRouter.use(authMiddleware.isAdminAuth)
adminRouter.post('/create-user', adminController.createUser)
adminRouter.post('/edit-user/id/:id', adminController.editUser)
adminRouter.post('/delete-user/id/:id', adminController.deleteUser)

adminRouter.use(notFound)
module.exports = adminRouter