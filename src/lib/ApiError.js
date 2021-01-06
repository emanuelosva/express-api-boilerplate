/**
 * ApiError class.
 * ---------------
 *
 * Custom error extended from native js Error
 * that allow handle http errors with a optimized
 * form to manage the error.
 */

const Logger = require('./logger')

class ApiError extends Error {
  constructor(status, message, data = {}, isOperational = false) {
    super(message)
    this.status = status
    this.data = data
    this.isOperational = isOperational
    Error.captureStackTrace(this)
  }

  async toOperational() {
    this.isOperational = true
  }

  async logError() {
    Logger.error(`Message: ${this.message} - Data: ${JSON.stringify(this.data)}`)
    if (this.isOperational) {
      Logger.error(this.stack)
    }
  }

  async sendEmailIfOperational() {
    if (this.isOperational) {
      Logger.info('Sending error email to Admin')
      /** @todo: Send email to Admin on operational error. */
    }
  }

  static raise = {
    badRequest: (message = 'bad request') => {
      throw new ApiError(400, message)
    },
    unauthorized: (message = 'unauthorized') => {
      throw new ApiError(401, message)
    },
    forbidden: (message = 'forbidden') => {
      throw new ApiError(403, message)
    },
    notFound: (message = 'not found') => {
      throw new ApiError(404, message)
    },
    conflict: (message = 'conflict with preexisting data') => {
      throw new ApiError(409, message)
    },
    preconditionFailed: (message = 'precondition failed') => {
      throw new ApiError(412, message)
    },
    serverError: (message = 'server error') => {
      throw new ApiError(500, message)
    },
  }
}

module.exports = ApiError
