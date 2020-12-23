const supertest = require('supertest')
const app = require('../../../src/app')
const db = require('../../../src/db/mongo')
const auth = require('../../../src/auth')
const UserService = require('../../../src/api/users/service')

module.exports = {
  request: supertest(app),
  db,
  auth,
  userService: new UserService(),
}
