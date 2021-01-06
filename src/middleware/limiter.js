/**
 * Request limiter middleware.
 * ---------------------------
 */

const rateLimit = require('express-rate-limit')
const config = require('../config')

const limiter = (maxRequestsPerMinute = 60) => {
  const limiterOpts = {
    windowMs: 1 * 60 * 1000,
    max: maxRequestsPerMinute,
  }

  if (config.api.REQUEST_LIMIT_IN_CACHE) {
    const RedisStore = require('rate-limit-redis')
    const { cacheClient } = require('../services/cache')
    limiterOpts.store = new RedisStore({ client: cacheClient })
  }

  const dummyLimiter = (req, res, next) => next()
  const limiterMiddleware = rateLimit(limiterOpts)

  if (config.app.IS_TEST) return dummyLimiter
  return limiterMiddleware
}

module.exports = limiter
