const logger = require('./logger')

class ApiError extends Error {
  constructor(status, message, isOperational = false, data = {}) {
    super(message)
    this.status = status
    this.isOperational = isOperational
    this.data = data
  }

  async toOperational() {
    this.isOperational = true
  }

  async logError() {
    logger.error(`Message: ${this.message} - Data: ${JSON.stringify(this.data)}`)
    if (this.isOperational) {
      logger.info(this.stack)
    }
  }

  async sendEmailIfOperational() {
    if (this.isOperational) {
      logger.info('Sending error email to Admin')
    }
  }

  static async handleError(err) {
    logger.error(err)
    await this.sendEmailIfOperational()
    process.exit(1)
  }

  static badRequest(message = 'bad request') {
    throw new ApiError(400, message)
  }

  static unauthorized(message = 'unauthorized') {
    throw new ApiError(401, message)
  }

  static forbidden(message = 'forbidden') {
    throw new ApiError(403, message)
  }

  static notFound(message = 'not found') {
    throw new ApiError(404, message)
  }

  static conflict(message = 'conflict with preexisting data') {
    throw new ApiError(409, message)
  }

  static preconditionFailed(message = 'precondition failed') {
    throw new ApiError(412, message)
  }

  static serverError(message = 'server error') {
    throw new ApiError(500, message)
  }
}

module.exports = ApiError
