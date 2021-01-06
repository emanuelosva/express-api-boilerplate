/**
 * Homegenized response function.
 * ------------------------------
 *
 * Return a custom response object with
 * extra properties to send info to client.
 */

const { httpCode } = require('../lib')
const config = require('../config')

exports.success = (req, res, status, data, message) => {
  const statusCode = status || httpCode.status.ok
  const statusMessage = message || httpCode.mapCodeToMessage[statusCode]

  return res.status(statusCode).json({
    error: false,
    message: statusMessage,
    data: data || {},
  })
}

exports.error = (req, res, status, data, message) => {
  const statusCode = status || httpCode.status.serverError
  const statusMessage = message || httpCode.mapCodeToMessage[statusCode]

  const errorObject = {
    error: true,
    data: data || {},
    message: '',
  }
  if (config.app.IS_PRODUCTION && statusCode === httpCode.status.serverError) {
    errorObject.message = httpCode.mapCodeToMessage(httpCode.status.serverError)
  } else {
    errorObject.message = statusMessage
  }

  return res.status(statusCode).json(errorObject)
}
