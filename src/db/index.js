const db = require('mongoose')
const config = require('../config')
const { logger, ApiError } = require('../lib')

db.Promise = global.Promise
class DB {
  static async connect() {
    db.connect(config.db.URL, {
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
    await db.connection.collection(collection).drop()
  }

  static async disconnect() {
    await db.disconnect()
  }
}

module.exports = DB
