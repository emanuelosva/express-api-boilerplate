/**
 * Central error handler middleware.
 * ---------------------------------
 *
 * All error must be passed trhough next function
 * to this middleware to be handle properly and
 * return a homegenized error response.
 *
 */

const { response } = require('../core')
const { ErrorHandler } = require('../lib')
const httpCode = require('../lib/httpCode')

const centralErrorHandler = async (err, req, res, next) => {
  const error = ErrorHandler.handleError(err)

  if (error.status === httpCode.status.unauthorized) {
    res.set('WWW-Authenticate', 'JWT')
  }

  return response.error(req, res, error.status, error.data, error.message)
}

module.exports = centralErrorHandler
