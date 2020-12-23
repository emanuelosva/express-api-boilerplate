
const { httpCode, logger } = require('../lib')

const logRequest = async (req, statusCode, message) => {
  const ellapsedTime = +new Date() - req.initialTime
  const info = req.logMessage +
  ` => Status: ${statusCode} - ${message}` +
  ` - Time: ${ellapsedTime} ms`
  logger.info(info)
}

exports.success = (req, res, status, data, message) => {
  const statusCode = status || httpCode.status.ok
  const statusMessage = message || httpCode.mapCodeToMessage[statusCode]

  logRequest(req, statusCode, statusMessage)

  return res.status(statusCode).json({
    error: false,
    message: statusMessage,
    data: data || {},
  })
}

exports.error = (req, res, status, data, message) => {
  const statusCode = status || httpCode.status.serverError
  const statusMessage = message || httpCode.mapCodeToMessage[statusCode]

  logRequest(req, statusCode, statusMessage)

  return res.status(statusCode).json({
    error: true,
    message: statusCode === 500 ? 'server error' : statusMessage,
    data: data || {},
  })
}
