/**
 * Mongoose DB connection class
 * ----------------------------
 *
 * Mongoose class to handle connection,
 * droping and close connection operations.
 */

const mongoose = require('mongoose')
const config = require('../config')
const { Logger, ErrorHandler } = require('../lib')

mongoose.Promise = global.Promise

class DB {
  static logger = new Logger('DB')
  static connection = mongoose.connection
  static db = mongoose.connection.db

  static async connect() {
    const url = config.app.IS_TEST
      ? config.db.URL_TEST
      : config.db.URL
    try {
      await mongoose.connect(url, {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      })
      this.logger.info(`DB connected. ENV: ${process.env.NODE_ENV}`)
    } catch (error) {
      this.logger.error('Connection error')
      ErrorHandler.handleFatalError(error)
    }
  }

  static async drop() {
    try {
      await this.connection.dropDatabase()
      this.logger.info('DB dropped')
    } catch (error) {
      this.logger.error('Dropping error:')
      ErrorHandler.handleFatalError(error)
    }
  }

  static async disconnect() {
    try {
      await this.connection.close()
      this.logger.info('DB connection closed')
    } catch (error) {
      this.logger.error('Disconect error:')
      ErrorHandler.handleFatalError(error)
    }
  }
}

module.exports = DB
