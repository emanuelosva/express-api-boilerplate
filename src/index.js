/**
 * Server entrypoint.
 * ------------------
 */

import App from './app'
import ApiRouter from './api'
import { ErrorHandler } from './lib'

const app = new App([
  ApiRouter,
])

if (require.main) {
  process.on('uncaughtException', ErrorHandler.handleFatalError)
  process.on('unhandledRejection', ErrorHandler.handleFatalError)
  app.listen()
}

const server = app.getServer()
export default server
