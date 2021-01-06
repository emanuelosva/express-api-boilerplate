/**
 * Request logger middleware.
 * --------------------------
 *
 * Show relevant info of each request.
 */

import morgan from 'morgan'
import config from '../config'

const requestLogger = () => {
  if (config.app.IS_PRODUCTION) return morgan('combined')
  const devRequestLogger = morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res), '-',
      tokens.status(req, res), '|',
      tokens['response-time'](req, res), 'ms', '\n',
      '=> body:', JSON.stringify(req.body), '\n',
      '=> query:', JSON.stringify(req.query), '\n',
      '=> params:', JSON.stringify(req.params),
    ].join(' ')
  })
  return devRequestLogger
}

module.exports = requestLogger
