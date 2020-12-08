const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { notFoundHandler, errorHandler, logRequest } = require('./middleware')

/**
 * App instance
 */
const app = express()

/**
 * Parsers
 */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logRequest)

/**
 * Security
 */
app.use(cors())
app.use(helmet())

/**
 * Routers
 */

/**
 * Error handler
 */
app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app
