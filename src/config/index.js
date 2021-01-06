/**
 * Global App configuration
 * ------------------------
 *
 * All env vars and general configuration
 * must be pñaced in this file inside the config
 * object.
 */

const path = require('path')
const { getOsEnv } = require('./utils')

require('dotenv').config({
  path: path.resolve(__dirname, `../../.env.${getOsEnv('NODE_ENV')}`),
})

module.exports = {
  app: {
    PORT: getOsEnv('PORT', 3000),
    IS_PRODUCTION: getOsEnv('NODE_ENV') === 'production',
    IS_DEV: getOsEnv('NODE_ENV') === 'development',
    IS_TEST: getOsEnv('NODE_ENV') === 'test',
  },
  api: {
    REQUEST_LIMIT_IN_CACHE: getOsEnv('REQUEST_LIMIT_IN_CACHE', false),
    CACHE_SECONDS: getOsEnv('CACHE_SECONDS', 10),
  },
  db: {
    URL: getOsEnv('MONGO_URL'),
    URL_TEST: getOsEnv('MONOG_URL_TEST'),
  },
  redis: {
    URL: getOsEnv('REDIS_URL'),
    HOST: getOsEnv('REDIS_HOST', 'localhost'),
    PORT: getOsEnv('REDIS_PORT', '6379'),
    PASSWORD: getOsEnv('REDIS_PASSWORD', 'redis'),
  },
  security: {
    allowedCors: getOsEnv('ALLOWED_CORS', ['*']),
    SECRET: getOsEnv('SECRET', 'devSecret'),
    ALGORITHMS: ['HS256'],
  },
  mailing: {
    API_KEY: getOsEnv('MAILGUN_API_KEY'),
    DOMAIN: getOsEnv('MAILGUN_DOMAIN'),
    FROM_EMAIL: getOsEnv('MAILGUN_DOMAIN', 'example@samples.mailgun.org'),
    FROM_EMAIL_NAME: getOsEnv('FROM_EMAIL_NAME', 'My App'),
  },
}
