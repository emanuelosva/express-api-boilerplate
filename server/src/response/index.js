
const { httpCode, logger } = require('../lib')

const logRequest = (req, statusCode, message) => {
  const ellapsedTime = +new Date() - req.initialTime
  const info = req.logMessage +
  ` => Status: ${statusCode} - ${message}` +
  ` - Time: ${ellapsedTime} ms`
  logger.info(info)
}

exports.success = (req, res, status, data, detail) => {
  const statusCode = status || httpCode.status.ok
  const statusMessage = detail || httpCode.mapCodeToMessage[statusCode]

  logRequest(req, statusCode, statusMessage)

  return res.status(statusCode).json({
    error: false,
    detail: statusMessage,
    data: data || {},
  })
}

exports.error = (req, res, status, data, detail) => {
  const statusCode = status || httpCode.status.serverError
  const statusMessage = detail || httpCode.mapCodeToMessage[statusCode]

  logRequest(req, statusCode, statusMessage)

  return res.status(statusCode).json({
    error: true,
    detail: statusMessage,
    data: data || {},
  })
}
