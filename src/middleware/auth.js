const { ApiError } = require('../lib')
const { jwt, tokenTypes, scopes } = require('../auth')
const httpCode = require('../lib/httpCode')
const { User } = require('../api/users/models')

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

const IsAuthenticated = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req)
    const { email, type, scope } = await jwt.verify(token)

    if (type !== tokenTypes.auth) ApiError.forbidden()

    const user = await User.findOne({ email }, 'id email phoneNumber name isActive').lean()
    if (!user || !user.isActive) ApiError.unauthorized()
    req.user = { ...user, scope, id: String(user._id) }
    next()
  } catch (error) {
    if (error.status) return next(error)
    next(new ApiError(httpCode.status.unauthorized))
  }
}

const IsAccountOwner = (req, res, next) => {
  const { params: { id } } = req
  if (id === req.user.id) {
    return next()
  }
  next(new ApiError(httpCode.status.forbidden))
}

const IsAdmin = (req, res, next) => {
  const { user: { type } } = req
  if (type === scopes.superAdmin || type === scopes.admin) {
    return next()
  }
  next(new ApiError(httpCode.status.forbidden, 'you dont have access to resource'))
}

const IsSuperAdmin = (req, res, next) => {
  if (req.user.type === scopes.superAdmin) {
    return next()
  }
  next(new ApiError(httpCode.status.forbidden, 'you dont have access to resource'))
}

const IsAccountOwnerOrAdmin = (req, res, next) => {
  const { params: { id }, user } = req
  if (id === user.id || user.type === scopes.admin) {
    return next()
  }
  next(new ApiError(httpCode.status.forbidden, 'you dont have access to resource'))
}

const IsAccountOwnerOrSuperAdmin = (req, res, next) => {
  const { params: { id }, user } = req
  if (id === user.id || user.type === scopes.superAdmin) {
    return next()
  }
  next(new ApiError(httpCode.status.forbidden, 'you dont have access to resource'))
}

module.exports = {
  IsAuthenticated,
  IsAccountOwner,
  IsAdmin,
  IsSuperAdmin,
  IsAccountOwnerOrAdmin,
  IsAccountOwnerOrSuperAdmin,
}