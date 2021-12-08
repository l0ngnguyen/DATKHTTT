const postRouter = require('express').Router()
const postController = require('../controllers/postController')
const authMiddleware = require('../middlewares/authentication')
const notFound = require('./404')

//chua viet API doc, doi lam duoc vote thi viet 
postRouter.get('/id/:id', postController.getPost)
postRouter.get('/list', postController.getPostList)
postRouter.get('/search', postController.searchPost)
postRouter.get('/vote-num', postController.getVoteNum)
postRouter.get('/tag', postController.getTags)

postRouter.use(authMiddleware.isAuth)
postRouter.post('/user/get-vote', postController.getUserVote)
postRouter.post('/user/delete-vote', postController.deleteUserVote)
postRouter.post('/user/create-vote', postController.creteUserVote)
postRouter.post('/create-post', postController.createPost)
postRouter.post('/edit-post', postController.editPost)
postRouter.post('/delete-post', postController.deletePost)

postRouter.use(notFound)


module.exports = postRouter