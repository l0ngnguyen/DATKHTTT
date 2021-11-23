const authRouter = require('./authRoutes')
const userRouter = require('./userRouters')
module.exports = function (app) {
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
}