const db = require('mongoose')
const config = require('../config')
const { logger, ApiError } = require('../lib')

db.Promise = global.Promise

class DB {
  static async connect() {
    const url = config.app.IS_TEST
      ? config.db.URL_TEST
      : config.db.URL
    db.connect(url, {
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }).then(() => {
      logger.info('DB connected')
    }).catch(async (err) => {
      await ApiError.handleError(err)
    })
  }

  static async drop(collection) {
    await db.connection.dropDatabase()
  }

  static async disconnect() {
    await db.connection.close()
  }
}

module.exports = DB
