/**
 * API Router.
 * -----------
 */

const { Router } = require('express')
const UserRoutes = require('./users/routes')
// const TodoRoutes = require('./todo/routes')

module.exports = (app) => {
  const ApiRouter = Router()

  /**
   * V1 Routers
   */
  UserRoutes(ApiRouter, '/api/v1')
}
