/**
 * API Router.
 * -----------
 */

const { Router } = require('express')
const UserRoutes = require('./users/routes')
const TodoRoutes = require('./todo/routes')

/**
 * V1 Routers
 */
module.exports.ApiRouterV1 = (app) => {
  const ApiRouter = Router()
  app.use('/api/v1', ApiRouter)

  /**
   * Routers
   */
  UserRoutes(ApiRouter, '/users')
  TodoRoutes(ApiRouter, '/todos')
}
