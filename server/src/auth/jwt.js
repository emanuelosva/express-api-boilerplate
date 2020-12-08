/**
 * @fileoverview JWT implementation
 */

const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const config = require('../config')
const { ApiError } = require('../lib')

exports.sign = async (payload, expiration) => {
  const DEFAULT_EXPIRATION_TIME = '1 day'

  if (!payload.email || !payload.type || !payload.scope) {
    throw new Error('Payload must contain properties: [email, type, scope]')
  }
  const sign = promisify(jwt.sign)
  const token = await sign(payload, config.security.SECRET, {
    algorithm: config.security.ALGORITHMS[0],
    expiresIn: expiration || DEFAULT_EXPIRATION_TIME,
  })
  return token
}

exports.verify = async (token) => {
  const verify = promisify(jwt.verify)
  try {
    const payload = await verify(token, config.security.SECRET, {
      algorithms: config.security.ALGORITHMS,
    })
    return payload
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) ApiError.forbidden('token expired')
    ApiError.unauthorized()
  }
}
