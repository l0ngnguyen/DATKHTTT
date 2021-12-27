const userRouters = require('express').Router()
const imageUploadMiddlewares = require('../middlewares/imageUpload')
const userController = require('../controllers/userController')
const authMiddleware = require('../middlewares/authentication')
const notFound = require('./404')


//userRouters.get('/list', userController.getUserList)
userRouters.get('/id/:id', userController.getUser)

userRouters.get('/email/:email', userController.getUserByEmail)
userRouters.get('/username/:username', userController.getUserByUserName)
//userRouters.get('/search', userController.searchUser)

userRouters.post('/upload-avatar/', imageUploadMiddlewares, userController.uploadImage)
userRouters.get('/get-avatar/id/:id', userController.getAvatar)
userRouters.get('/list', userController.getListUser)

userRouters.use(authMiddleware.isAuth)
userRouters.post('/link-with-google-account', userController.linkWithGoogleAccount)
userRouters.post('/edit-profile', userController.editProfile)
userRouters.post('/edit-user/edit-email/sent-otp', userController.sendOtpEditEmail)
userRouters.post('/edit-user/edit-email/check-otp', userController.checkOtpEditEmail)
userRouters.post('/edit-user/change-password', userController.changePassword)

userRouters.use(notFound)

module.exports = userRouters