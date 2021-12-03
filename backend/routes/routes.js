const authRouter = require('./authRoutes')
const userRouter = require('./userRouters')
const tagRouter = require('./tagRouters')
module.exports = function (app) {
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/tag', tagRouter)
}