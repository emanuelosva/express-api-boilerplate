require('dotenv').config()

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

module.exports = {
  app: {
    PORT: process.env.PORT || 3000,
    IS_PRODUCTION: IS_PRODUCTION,
    IS_TEST: process.env.NODE_ENV === 'test',
    IS_SERVERLESS: process.env.IS_SERVERLESS || false,
    CONFIRM_ACCOUNT_URL: process.env.CONFIRM_ACCOUNT_URL,
    WEB_URL: IS_PRODUCTION
      ? process.env.PRODUCTION_WEB_URL
      : process.env.DEV_WEB_URL,
  },
  db: {
    URL: process.env.MONOG_URL,
    URL_TEST: process.env.MONOG_URL_TEST,
  },
  redis: {
    URL: process.env.REDIS_URL,
    HOST: process.env.REDIS_HOST,
    PORT: process.env.REDIS_PORT || '6379',
    PASSWORD: process.env.REDIS_PASSWORD || null,
  },
  security: {
    SECRET: process.env.SECRET || 'secret',
    ALGORITHMS: ['HS256'],
    allowedCors: process.env.ALLOWED_CORS || '*',
  },
  mailing: {
    API_KEY: process.env.MAILGUN_API_KEY,
    DOMAIN: process.env.MAILGUN_DOMAIN || 'sandbox4c67baf640164818bf8e0201ddba1c4f.mailgun.org',
  },
}
