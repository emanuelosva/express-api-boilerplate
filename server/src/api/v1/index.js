const { Router } = require('express')
const { UsersRouter } = require('../users')

const ApiRouter = Router()

ApiRouter.use('/users', UsersRouter)

module.exports = ApiRouter
