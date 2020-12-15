const { User, RefreshToken } = require('./models')
const { ApiError } = require('../../lib')
const { createToken } = require('../../auth')
const { Service } = require('../../core')

class UserService extends Service {
  constructor(userODM = User, refreshTokenODM = RefreshToken) {
    super(userODM, { activeSchema: true, paginationLimit: 50 })
    this.RefreshToken = refreshTokenODM
  }

  async insert({ email, password, phoneNumber, name }) {
    try {
      let user = await this.model.create({ email, password, phoneNumber, name })
      user = user.toJSON()

      // TODO: implement a secuity flow to confirm account.

      return this.sanitize(user)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async login({ email, password }) {
    try {
      const user = await this.model.findOne({ email })
      const correctPassword = user && await user.comparePassword(password)
      if (!correctPassword) ApiError.unauthorized()
      const token = await this.RefreshToken.create({ email: user.email })
      const accessToken = await createToken(user.email, user.type)
      return {
        user: this.sanitize(user),
        accessToken,
        refreshToken: token.token,
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async refreshToken({ email, token }) {
    try {
      const storedToken = await this.RefreshToken.findOne({ token })
      if (!storedToken || storedToken.email !== email || storedToken.isInvalid) {
        ApiError.forbidden()
      }
      const user = await this.model.findOne({ email }).lean()
      const accessToken = await createToken(email, user.type)
      return {
        user: this.sanitize(user),
        accessToken,
        refreshToken: token,
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async delete(id) {
    const user = await this.model.findOne({ _id: id })
    if (!user) ApiError.notFound('user not found')
    user.isActive = false
    await user.save()
  }
}

module.exports = UserService
