/**
 * JWT class implemntation.
 * ------------------------
 *
 * Perform all actions to create and
 * validate correctly JWTs.
 */

const jwt = require('jsonwebtoken')
const { ApiError } = require('../lib')
const config = require('../config')

class JWT {
  static DEFAULT_EXPIRATION_TIME = '3 hours'

  static async sign(payload, expiration = JWT.DEFAULT_EXPIRATION_TIME) {
    return new Promise((resolve, reject) => {
      try {
        if (!payload.email || !payload.scope) {
          throw new Error('email and scope are needed')
        }
        payload.type = payload.type ? payload.type : tokenTypes.AUTH
        const token = jwt.sign(payload, config.secutity.SECRET, {
          algorithm: config.security.ALGORITHMS[0],
          expiresIn: expiration,
        })
        return resolve(token)
      } catch (error) {
        return reject(error)
      }
    })
  }

  static async verify(token) {
    return new Promise((resolve) => {
      try {
        const payload = jwt.verify(token, config.secutity.SECRET, {
          algorithms: config.security.ALGORITHMS,
        })
        return resolve(payload)
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          ApiError.raise.forbidden('token expired')
        }
        ApiError.raise.unauthorized()
      }
    })
  }
}

module.exports = JWT
