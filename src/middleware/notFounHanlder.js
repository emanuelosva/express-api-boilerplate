const { ApiError } = require('../lib')

const notFoundHandler = (req, res, next) => {
  try {
    ApiError.notFound()
  } catch (error) {
    next(error)
  }
}

module.exports = notFoundHandler
