/**
 * Authentication middleware.
 * --------------------------
 *
 * Validate request autentication and authorization
 * permissions.
 */

const { ApiError } = require('../lib')
const { JWT, tokenTypes, scopes } = require('../auth')
const httpCode = require('../lib/httpCode')
const { User } = require('../api/users/models')

const getTokenFromHeader = (req) => {
  const authorization = req.headers && req.headers.authorization
  if (authorization) {
    try {
      const token = authorization.split('Bearer ')[1]
      return token
    } catch (error) {
      ApiError.raise.unauthorized()
    }
  }
  ApiError.raise.unauthorized()
}

class Auth {
  static isAuthenticated() {
    return async (req, res, next) => {
      try {
        const token = getTokenFromHeader(req)
        const { email, type, scope } = await JWT.verify(token)

        if (type === tokenTypes.auth) {
          const user = await User.findOne({ email }, 'id email phoneNumber name isActive').lean()
          if (user && user.isActive) {
            req.user = { ...user, type: scope, id: String(user._id) }
            return next()
          }
        }

        ApiError.raise.unauthorized('invalid credentials')
      } catch (error) {
        if (error.status) return next(error)
        next(new ApiError(httpCode.status.unauthorized))
      }
    }
  }

  static isAuthorized(scope) {
    return (req, res, next) => {
      try {
        let allowedScopes = scope
        if (typeof scope === 'string') {
          allowedScopes = [scope]
        }
        const { user } = req
        if (user) {
          const scope = user.type
          if (allowedScopes.includes(scope)) return next()
          ApiError.raise.forbidden()
        }
      } catch (error) {
        return next(error)
      }
    }
  }

  static _isOwner(req, field = 'id', where = 'params') {
    const userIdentifier = req[where][field]
    return userIdentifier === req.user?.id
  }

  static isOwner(field = 'id', where = 'body') {
    return (req, res, next) => {
      try {
        if (this._isOwner(req, field, where)) return next()
        ApiError.raise.forbidden()
      } catch (error) {
        return next(error)
      }
    }
  }

  static isOwnerOrAdmin(field = 'id', where = 'params') {
    return (req, res, next) => {
      try {
        const type = req.user?.type
        const isOwner = this._isOwner(req, field, where)
        const isAdminOrSuperAdmin = type === scopes.ADMIN || type === scopes.SUPER_ADMIN
        if (isOwner || isAdminOrSuperAdmin) return next()
        ApiError.raise.forbidden()
      } catch (error) {
        return next(error)
      }
    }
  }

  static isOwnerOrSuperAdmin(field = 'id', where = 'params') {
    return (req, res, next) => {
      try {
        if (this._isOwner(req, field, where) || req.user?.type === scopes.SUPER_ADMIN) {
          return next()
        }
        ApiError.raise.forbidden()
      } catch (error) {
        return next(error)
      }
    }
  }
}

module.exports = Auth
