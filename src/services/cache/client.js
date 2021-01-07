/**
 * Redis client connection.
 * ------------------------
 *
 * Handle redis connection and client
 * events configuration.
 */

const redis = require('redis')
const config = require('../../config')
const { ErrorHandler, Logger } = require('../../lib')

const cacheClient = redis.createClient(config.redis.URL)

cacheClient.on('ready', () => {
  Logger.info('Redis connected')
})

cacheClient.on('error', (err) => {
  ErrorHandler.handleError(err)
})

module.exports = cacheClient
