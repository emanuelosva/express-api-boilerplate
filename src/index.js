/**
 * Server entrypoint.
 * ------------------
 */

const App = require('./app')
const { ErrorHandler } = require('./lib')
const { ApiRouterV1 } = require('./api')

const app = new App([
  ApiRouterV1,
])

if (require.main) {
  process.on('uncaughtException', ErrorHandler.handleFatalError)
  process.on('unhandledRejection', ErrorHandler.handleFatalError)
  app.listen()
}

const server = app.getServer()
module.exports = server
