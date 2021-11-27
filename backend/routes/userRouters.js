const userRouters = require('express').Router()
const imageUploadMiddlewares = require('../middlewares/imageUpload')
const userController = require('../controllers/userController')
const authMiddleware = require('../middlewares/authentication')



//userRouters.get('/list', userController.getUserList)
userRouters.get('/id/:id', userController.getUser)
userRouters.get('/email/:email', userController.getUserByEmail)
userRouters.get('/username/:username', userController.getUserByUserName)
//userRouters.get('/search', userController.searchUser)

userRouters.post('/upload-avatar/', imageUploadMiddlewares, userController.uploadImage)

userRouters.use(authMiddleware.isAuth)
userRouters.post('/link-with-google-account', userController.linkWithGoogleAccount)
userRouters.post('/', userController.createUser)


module.exports = userRouters