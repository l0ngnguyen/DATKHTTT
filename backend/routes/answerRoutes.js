const answerRouter = require('express').Router()
const answerController = require('../controllers/answerController')
const authMiddleware = require('../middlewares/authentication')
const notFound = require('./404')

answerRouter.get('/id/:id', answerController.getAnswer)
answerRouter.get('/list', answerController.getAnswerList)
answerRouter.get('/vote-num', answerController.getVoteNum)

answerRouter.use(authMiddleware.isAuth)
answerRouter.post('/user/get-vote', answerController.getUserVote)
answerRouter.post('/user/delete-vote', answerController.deleteUserVote)
answerRouter.post('/user/create-vote',answerController.creteUserVote)
answerRouter.post('/create-answer', answerController.createAnswer)
answerRouter.post('/edit-answer', answerController.editAnswer)
answerRouter.post('/delete-answer', answerController.deleteAnswer)

answerRouter.use(notFound)


module.exports = answerRouter