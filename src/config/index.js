require('dotenv').config()

module.exports = {
  app: {
    PORT: process.env.PORT || 3000,
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    IS_TEST: process.env.NODE_ENV === 'test',
  },
  db: {
    URL: process.env.MONOG_URL,
  },
  security: {
    SECRET: process.env.SECRET || 'secret',
    ALGORITHMS: ['HS256'],
    allowedCors: [],
  },
}
