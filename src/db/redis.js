const redis = require('redis')
const config = require('../config')
const { ApiError, logger } = require('../lib')

const client = redis.createClient(config.redis.URL)

client.on('ready', () => {
  logger.info('Redis connected')
})

client.on('error', (err) => {
  ApiError.handleError(err)
})

module.exports = client
