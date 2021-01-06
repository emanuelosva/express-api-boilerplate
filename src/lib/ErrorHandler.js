/**
 * Central error handler.
 * ----------------------
 *
 * Handle all error in a decicated object.
 */

const ApiError = require('./ApiError')
const Logger = require('./logger')
const httpCode = require('./httpCode')

class ErrorHandler {
  static async handleError(errorObject) {
    let error = errorObject

    if (!(error instanceof ApiError)) {
      const message = errorObject.message || 'server error'
      error = new ApiError(httpCode.status.serverError, message)
      await error.toOperational()
    }

    await error.logError()
    await error.sendEmailIfOperational()
    return error
  }

  static handleFatalError(err) {
    Logger.error(err.message)
    Logger.error(err.stack)
    process.exit(1)
  }
}

module.exports = ErrorHandler
