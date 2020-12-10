const { ApiError } = require('../lib')
const { jwt, tokenTypes } = require('../auth')
const httpCode = require('../lib/httpCode')
const { User } = require('../api/users/models')

const parseRoles = (roles) => {
  if (roles) {
    if (Array.isArray(roles)) return roles
    return [roles]
  }
  return null
}

const verifyScope = async (scope, roles) => {
  if (roles) {
    const currentRoles = parseRoles(roles)
    if (!currentRoles.includes(scope)) ApiError.forbidden()
  }
}

const extractTokenFromHeader = (req) => {
  try {
    const { authorization } = req.headers
    if (!authorization) ApiError.unauthorized()
    const token = authorization.split('Bearer ')[1]
    return token
  } catch (error) {
    ApiError.unauthorized()
  }
}

const isAuthenticate = (roles = null) => async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req)
    const { email, type, scope } = await jwt.verify(token)

    if (type !== tokenTypes.auth) ApiError.forbidden()

    const user = await User.findOne({ email }, '_id email phoneNumber name')
    if (!user) ApiError.unauthorized()

    await verifyScope(scope, roles)

    req.user = user
    next()
  } catch (error) {
    if (error.status) return next(error)
    next(new ApiError(httpCode.status.unauthorized, 'unauthorized'))
  }
}

module.exports = isAuthenticate
