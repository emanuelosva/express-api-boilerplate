const { response } = require('../../core')
const UserService = require('./service')
const { User, RefreshToken } = require('./models')
const { Controller } = require('../../core')
const { scopes } = require('../../auth')

const userService = new UserService(User, RefreshToken)

class UserController extends Controller {
  constructor(service = userService) {
    super(service, { serviceName: 'user' })
    this.refreshToken = this.refreshToken.bind(this)
    this.login = this.login.bind(this)
    this.signup = this.signup.bind(this)
    this.createAdmin = this.createAdmin.bind(this)
    this.createSuperAdmin = this.createSuperAdmin.bind(this)
    this.verifyAccount = this.verifyAccount.bind(this)
  }

  async createSuperAdmin(req, res, next) {
    try {
      const { body: userDTO } = req
      const data = await this.service.insert({ ...userDTO, type: scopes.superAdmin })
      return response.success(req, res, 201, data, 'user created')
    } catch (error) {
      return next(error)
    }
  }

  async createAdmin(req, res, next) {
    try {
      const { body: userDTO } = req
      const data = await this.service.insert({ ...userDTO, type: scopes.admin })
      return response.success(req, res, 201, data, 'user created')
    } catch (error) {
      return next(error)
    }
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

  async verifyAccount(req, res, next) {
    try {
      const { query: { token } } = req
      const data = await this.service.verify({ token })
      return response.success(req, res, 200, data, 'account verified')
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
}

module.exports = new UserController(userService)
