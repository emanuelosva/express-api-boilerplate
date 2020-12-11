const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const DB = require('./db')
const { notFoundHandler, errorHandler, logRequest } = require('./middleware')
const ApiRouter = require('./api/v1')

/**
 * App instance
 */
const app = express()
DB.connect()

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
app.use('/api/v1', ApiRouter)

/**
 * Error handler
 */
app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app
