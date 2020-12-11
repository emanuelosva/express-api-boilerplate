const { response } = require('../../../core')
const UserService = require('./service')
const { User, RefreshToken } = require('./models')
const { Controller } = require('../../../core')

const userService = new UserService(User, RefreshToken)

class UserController extends Controller {
  constructor(service = userService) {
    super(service, 'user')
  }

  async signup(req, res, next) {
    try {
      const { body: userDTO } = req
      const data = await this.service.signup(userDTO)
      return response.success(req, res, 201, data, 'user created')
    } catch (error) {
      return next(error)
    }
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

  async getOne(req, res, next) {
    try {
      const { user: { email } } = req
      const data = await this.service.findByEmail(email)
      return response.success(req, res, 200, data, 'user data')
    } catch (error) {
      return next(error)
    }
  }

  async update(req, res, next) {
    try {
      const { user: { id }, body: userUpdateDTO } = req
      const data = await this.service.update(id, userUpdateDTO)
      return response.success(req, res, 200, data, 'user updated')
    } catch (error) {
      return next(error)
    }
  }

  async delete(req, res, next) {
    try {
      const { user: { id } } = req
      const data = await this.service.delete(id)
      return response.success(req, res, 200, data, 'user deletd')
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = new UserController(userService)
