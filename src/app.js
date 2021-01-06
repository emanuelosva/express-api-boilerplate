/**
 * Server APP configuration.
 * -------------------------
 *
 * This class handle all express server
 * configuration.
 * Middlewares, routes and handlers are intialized
 * by this class.
 */

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const mongoSanitize = require('express-mongo-sanitize')
const config = require('./config')
const { DB } = require('./db')
const { Logger } = require('./lib')
const { notFoundHandler, centralErrorHandler, requestLogger } = require('./middleware')

class App {
  constructor(routers) {
    this.app = express()

    this.initDB()

    this.initializeParsers()
    this.initializeMiddlewares()
    this.registerRouters(routers)
    this.addErrorHandling()
  }

  getServer() {
    return this.app
  }

  listen() {
    this.app.listen(config.app.PORT, () => {
      Logger.info(`App launching 🚀 on port: ${config.app.PORT}`)
    })
  }

  async initDB() {
    await DB.connect()
  }

  registerRouters(routers) {
    routers.forEach((router) => {
      this.app.use('/api', router)
    })
  }

  initializeParsers() {
    this.app.use(compression())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  initializeMiddlewares() {
    this.app.use(requestLogger())
    this.app.use(cors())
    this.app.use(helmet())
    this.app.use(mongoSanitize())
  }

  addErrorHandling() {
    this.app.use(notFoundHandler)
    this.app.use(centralErrorHandler)
  }
}

module.exports = App
