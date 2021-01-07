/**
 * User controller.
 * ----------------
 *
 * This class handle all request to resources
 * directly related with User entitie.
 */

const UserService = require('./service')
const { User } = require('./models')
const { response, Controller } = require('../../core')
const { scopes } = require('../../auth')

class UserController extends Controller {
  constructor(service = new UserService(User)) {
    super(service, {
      name: 'user',
      queryField: 'id',
      queryIn: 'params',
      aditionalFilter: { isActive: true },
    })

    this.createSuperAdmin = this.createSuperAdmin.bind(this)
    this.createAdmin = this.createAdmin.bind(this)
    this.signup = this.signup.bind(this)

    this.confirmAccount = this.confirmAccount.bind(this)
    this.refreshToken = this.refreshToken.bind(this)
    this.login = this.login.bind(this)
  }

  async createSuperAdmin(req, res, next) {
    try {
      const { body: userDTO } = req
      const data = await this.service.insert({ ...userDTO, type: scopes.SUPER_ADMIN, isActive: true })
      return response.success(req, res, 201, data, 'user created')
    } catch (error) {
      return next(error)
    }
  }

  async createAdmin(req, res, next) {
    try {
      const { body: userDTO } = req
      const data = await this.service.insert({ ...userDTO, type: scopes.ADMIN, isActive: true })
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

  async confirmAccount(req, res, next) {
    try {
      const { body: { token } } = req
      const data = await this.service.confirmAccount({ token })
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

module.exports = UserController
