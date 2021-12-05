const authRouter = require('./authRoutes')
const userRouter = require('./userRoutes')
const tagRouter = require('./tagRoutes')
const postRouter = require('./postRoutes')
const notFound = require('./404')

module.exports = function (app) {
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/tag', tagRouter)
    app.use('/post', postRouter)

    app.use(notFound)
}