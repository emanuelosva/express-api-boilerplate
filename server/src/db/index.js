const db = require('mongoose')
const config = require('../config')
const { logger, ApiError } = require('../lib')

db.Promise = global.Promise

const initDb = () => {
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

module.exports = initDb
