const response = require('../response')
const { ApiError } = require('../lib')
const httpCode = require('../lib/httpCode')

const errorHandler = async (err, req, res, next) => {
  let error = err

  if (!(err instanceof ApiError)) {
    error = new ApiError(httpCode.status.serverError, err.message)
    error.stack = err.stack
    await error.toOperational()
  }

  await error.logError()
  await error.sendEmailIfOperational()

  return response.error(req, res, error.status, error.data, error.message)
}

module.exports = errorHandler
