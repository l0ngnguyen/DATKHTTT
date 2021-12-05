const postRouter = require('express').Router()
const tagController = require('../controllers/tagController')
const authMiddleware = require('../middlewares/authentication')
const notFound = require('./404')


postRouter.get('/id/:id', tagController.getTag)
postRouter.get('/list', tagController.getTagList)
postRouter.get('/search', tagController.searchTag)

postRouter.use(authMiddleware.isAuth)
postRouter.post('/create-tag', tagController.createTag)
postRouter.post('/edit-tag', tagController.editTag)
postRouter.post('/delete-tag', tagController.deleteTag)

postRouter.use(notFound)

module.exports = postRouter