const authRouter = require('express').Router()
const authController = require('../controllers/authController')

authRouter.post('/login', authController.login)
//authRouter.post('/logout', authController.logOut)
authRouter.post('/refresh-token', authController.refreshToken)

module.exports = authRouter