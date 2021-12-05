const postRouter = require('express').Router()
const postController = require('../controllers/postController')
const authMiddleware = require('../middlewares/authentication')

postRouter.get('/id/:id', postController.getPost)
postRouter.get('/list', postController.getPostList)
postRouter.get('/search', postController.searchPost)

postRouter.use(authMiddleware.isAuth)
postRouter.post('/create-post', postController.createPost)
postRouter.post('/edit-post', postController.editPost)
postRouter.post('/delete-post', postController.deletePost)

module.exports = postRouter