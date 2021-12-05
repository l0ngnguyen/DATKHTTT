const authRouter = require('express').Router()
const authController = require('../controllers/authController')
const notFound = require('./404')


authRouter.post('/login', authController.login)
authRouter.post('/logout', authController.logOut)
authRouter.post('/refresh-token', authController.refreshToken)

authRouter.post('/forget-password/send-otp', authController.sendOtpForgetPassword)
authRouter.post('/forget-password/check-otp', authController.checkOtpForgetPassword)
authRouter.post('/forget-password/reset-password', authController.forgetPassword)

authRouter.post('/login-with-google', authController.loginWithGoogle)

authRouter.post('/sign-up/send-otp', authController.sendOtpSignUp)
authRouter.post('/sign-up/check-otp', authController.checkOtpSignUp)
authRouter.post('/sign-up', authController.signUp)

authRouter.post('/sign-up-with-google', authController.signUpWithGoogle)

authRouter.use(notFound)

module.exports = authRouter
