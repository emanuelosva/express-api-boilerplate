/**
 * User service.
 * -------------
 *
 * This class handle all bussines logic
 * directly related with User entitie.
 */

const { User, RefreshToken } = require('./models')
const { Todo } = require('../todo/model')
const { ApiError } = require('../../lib')
const { tokenTypes, JWT } = require('../../auth')
const { Service } = require('../../core')
const { Cache } = require('../../services/cache')
const { Mailer, Templates } = require('../../services/mail')

class UserService extends Service {
  constructor(model = User) {
    super(model, {
      cache: new Cache('users'),
      name: 'user',
      paginationLimit: 50,
    })
  }

  async signup({ email, password, phoneNumber, name }) {
    try {
      const user = await super.insert({ email, password, phoneNumber, name })
      const token = await JWT.sign({ email: user.email, scope: user.type, type: tokenTypes.MAIL })
      await Mailer.sendFromTemplate({
        to: user.email,
        subject: 'Welcome to my app',
        template: Templates.cmr.welcome,
        vars: { name: user.name, token },
      })
      const accessToken = await JWT.sign({ email: user.email, scope: user.type })
      return { user, accessToken }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async confirmAccount({ token }) {
    try {
      const { email, type } = await JWT.verify(token)
      const user = await super.getOrRaiseNotFound({ email }, this.model)
      if (type === tokenTypes.MAIL) {
        user.isActive = true
        await user.save()
        const accessToken = await JWT.sign({ email: user.email, scope: user.type })
        return { user, accessToken }
      }
      ApiError.raise.forbidden('invalid token')
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async login({ email, password }) {
    try {
      const user = await this.model.findOne({ email })
      const correctPassword = user && await user.comparePassword(password)
      if (!correctPassword) ApiError.raise.unauthorized('invalid credentials')
      const { accessToken, refreshToken } = await this._getTokens(user)
      return { user, accessToken, refreshToken: refreshToken.token }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async refreshToken({ email, token }) {
    try {
      const user = await super.getOrRaiseNotFound({ email }, this.model)
      const { accessToken, refreshToken } = await this._getTokens(user, token)
      if (!refreshToken || refreshToken.email !== user.email || refreshToken.isInvalid) {
        ApiError.raise.forbidden()
      }
      return { user, accessToken, refreshToken: refreshToken.token }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getOne(query) {
    try {
      const user = await super.getOne(query)
      const todos = await Todo.find({ user: user.id })
      return { ...user, todos }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async delete(query) {
    try {
      const user = await super.getOrRaiseNotFound(query, this.model)
      if (user.isActive) {
        user.isActive = false
        await user.save()
        return null
      }
      ApiError.notFound(this.name + ' not found')
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async _getTokens(user, token = '') {
    try {
      let refreshToken = null
      const accessToken = await JWT.sign({ email: user.email, scope: user.type })
      if (token) {
        refreshToken = await RefreshToken.create({ email: user.email })
      } else {
        refreshToken = await RefreshToken.findOne({ token })
        if (!refreshToken) ApiError.raise.forbidden()
      }
      return { accessToken, refreshToken: refreshToken }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

module.exports = UserService
