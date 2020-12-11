const { Router } = require('express')
const UsersRouter = require('./users/routes')
const TodoRouter = require('./todo/routes')

const ApiRouterV1 = Router()

ApiRouterV1.use('/users', UsersRouter)
ApiRouterV1.use('/todos', TodoRouter)

module.exports = ApiRouterV1
