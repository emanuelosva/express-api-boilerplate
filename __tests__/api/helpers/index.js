const supertest = require('supertest')
const app = require('../../../src/app')
const db = require('../../../src/db')
const auth = require('../../../src/auth')

module.exports = {
  request: supertest(app),
  db,
  auth,
}
