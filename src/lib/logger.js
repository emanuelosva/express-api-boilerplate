/**
 * Core Logger class.
 * ------------------
 *
 * This is the main Logger Object. You can create a scope logger
 * or directly use the static log methods.
 */

const path = require('path')
const winston = require('winston')

/**
 * Winston configuration
 */
const { format, transports } = winston

winston.configure({
  format: format.combine(
    format.timestamp(),
    format.simple(),
  ),
  transports: [
    new transports.File({ filename: 'error', level: 'error' }),
    new transports.File({ filename: 'warning', level: 'warn' }),
    new transports.File({ filename: 'info', level: 'info' }),
    new transports.Console({
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DDTHH:mm' }),
        format.colorize(),
        format.simple(),
      ),
    }),
  ],
})

/**
 * Logger class
 */
class Logger {
  static DEFAULT_SCOPE = 'app'

  static info(message, ...args) {
    winston.info(`[${Logger.DEFAULT_SCOPE}] --> ${message} | `, args)
  }

  static error(message, ...args) {
    winston.error(`[error] --> ${message} | `, args)
  }

  static warn(message, ...args) {
    winston.warn(`[warning] --> ${message} | `, args)
  }

  static parsePathToScope(filepath) {
    if (filepath.indexOf(path.sep) >= 0) {
      filepath = filepath
        .replace(process.cwd(), '')
        .replace(`${path.sep}src${path.sep}`, '')
        .replace('.js', '')
        .replace(path.sep, ':')
    }
    return filepath
  }

  constructor(scope = Logger.DEFAULT_SCOPE) {
    this.scope = Logger.parsePathToScope(scope)
  }

  log(level, message, ...args) {
    if (winston) {
      winston[level](`[${this.scope}] --> ${message} | `, args)
    }
  }

  info(message, ...args) {
    this.log('info', message, args)
  }

  debug(message, ...args) {
    this.log('debug', message, args)
  }

  warn(message, ...args) {
    this.log('warn', message, args)
  }

  error(message, ...args) {
    this.log('error', message, args)
  }
}

module.exports = Logger
