const { User, RefreshToken } = require('./models')
const { ApiError } = require('../../../lib')
const { jwt, tokenTypes } = require('../../../auth')
const { Service } = require('../../../core')

class UserService extends Service {
  constructor(userODM = User, refreshTokenODM = RefreshToken) {
    super(userODM)
    this.RefreshToken = refreshTokenODM
  }

  async signup({ email, password, phoneNumber, name }) {
    try {
      const user = await this.model.create({ email, password, phoneNumber, name })
      return user
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async login({ email, password }) {
    try {
      const user = await this.model.findOne({ email })
      const correctPassword = user && await User.comparePassword(password)
      if (!correctPassword) ApiError.unauthorized()

      const token = await this.RefreshToken.create({ email: user.email })
      const accessToken = await jwt.sign({
        email: user.email,
        scope: user.type,
        type: tokenTypes.auth,
      })

      return {
        user,
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

      const user = await this.findByEmail(email)
      const accessToken = await jwt.sign({
        email: email,
        scope: user.type,
        type: tokenTypes.auth,
      })

      return {
        accessToken,
        refreshToken: token,
        user,
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findByEmail(email) {
    try {
      const user = await this.model.findOne({ email }).lean()
      if (user) return user
      ApiError.notFound('User not found')
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

module.exports = UserService
