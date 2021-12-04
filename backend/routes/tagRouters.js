const tagRouters = require('express').Router()
const tagController = require('../controllers/tagController')
const authMiddleware = require('../middlewares/authentication')

tagRouters.get('/id/:id', tagController.getTag)
tagRouters.get('/list', tagController.getTagList)
tagRouters.get('/search', tagController.searchTag)

tagRouters.use(authMiddleware.isAuth)
tagRouters.post('/create-tag', tagController.createTag)
tagRouters.post('/edit-tag', tagController.editTag)
tagRouters.post('/delete-tag', tagController.deleteTag)

module.exports = tagRouters