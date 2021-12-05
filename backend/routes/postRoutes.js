const postRouter = require('express').Router()
const postController = require('../controllers/postController')
const authMiddleware = require('../middlewares/authentication')
const notFound = require('./404')


postRouter.get('/id/:id', postController.getPost)
postRouter.get('/list', postController.getPostList)
postRouter.get('/search', postController.searchPost)

//chua viet API doc, doi lam duoc vote thi viet 
postRouter.use(authMiddleware.isAuth)
postRouter.post('/create-post', postController.createPost)
postRouter.post('/edit-post', postController.editPost)
postRouter.post('/delete-post', postController.deletePost)

postRouter.use(notFound)


module.exports = postRouter