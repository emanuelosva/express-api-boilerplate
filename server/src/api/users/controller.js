const { response } = require('../../core')
const UserService = require('./service')
const { User, RefreshToken } = require('./models')
const { Controller } = require('../../core')

const userService = new UserService(User, RefreshToken)

class UserController extends Controller {
  constructor(service = userService) {
    super(service, 'user')
  }

  async login(req, res, next) {
    try {
      const { body: { email, password } } = req
      const data = await this.service.login({ email, password })
      return response.success(req, res, 200, data, 'user logged')
    } catch (error) {
      return next(error)
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { body: { email, refreshToken: token } } = req
      const data = await this.service.refreshToken({ email, token })
      return response.success(req, res, 200, data, 'new token')
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = new UserController(userService)
