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
    badRequest: (message = 'bad request', data = {}, operational = false) => {
      throw new ApiError(400, message, data, operational)
    },
    unauthorized: (message = 'unauthorized', data = {}, operational = false) => {
      throw new ApiError(401, message, data, operational)
    },
    forbidden: (message = 'forbidden', data = {}, operational = false) => {
      throw new ApiError(403, message, data, operational)
    },
    notFound: (message = 'not found', data = {}, operational = false) => {
      throw new ApiError(404, message, data, operational)
    },
    conflict: (message = 'conflict with preexisting data', data = {}, operational = false) => {
      throw new ApiError(409, message, data, operational)
    },
    preconditionFailed: (message = 'precondition failed', data = {}, operational = false) => {
      throw new ApiError(412, message, data, operational)
    },
    serverError: (message = 'server error', data = {}, operational = false) => {
      throw new ApiError(500, message, data, operational)
    },
  }
}

module.exports = ApiError
