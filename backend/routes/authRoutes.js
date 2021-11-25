const authRouter = require('express').Router()
const authController = require('../controllers/authController')

authRouter.post('/login', authController.login)
authRouter.post('/logout', authController.logOut)
authRouter.post('/refresh-token', authController.refreshToken)
authRouter.post('/send-otp', authController.sendOtp)
authRouter.post('/check-otp', authController.checkOtp)
authRouter.post('/forget-password', authController.forgetPassword)
authRouter.post('/login-with-google', authController.loginWithGoogle)

module.exports = authRouter