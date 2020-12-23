const rateLimit = require('express-rate-limit')
const config = require('../config')

const dummyLimiter = (req, res, next) => next()

const limiter = (requestsPerMinute = 30) => {
  const limiterOpts = {
    windowMs: 1 * 60 * 1000,
    max: requestsPerMinute,
  }
  if (config.app.IS_SERVERLESS) {
    const RedisStore = require('rate-limit-redis')
    const client = require('../db/redis')
    limiterOpts.store = new RedisStore({ client })
  }
  if (config.app.IS_TEST) return dummyLimiter
  return rateLimit(limiterOpts)
}

module.exports = limiter
