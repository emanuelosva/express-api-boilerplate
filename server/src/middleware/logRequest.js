const logRequest = (req, res, next) => {
  const { method, originalUrl, hostname, body } = req

  req.initialTime = +new Date()
  req.logMessage = `METHOD: ${method} - URL: ${originalUrl}` +
    ` - HOST: ${hostname} || BODY: ${JSON.stringify(body)}`

  next()
}

module.exports = logRequest
