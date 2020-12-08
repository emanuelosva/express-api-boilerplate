const { validationResult } = require('express-validator')
const { ApiError, httpCode } = require('../lib')

const requestValidation = (validators) => async (req, res, next) => {
  await Promise.all(validators.map((validator) => validator.run(req)))
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  next(new ApiError(httpCode.status.badRequest, 'bad request', false, errors.array()))
}

module.exports = requestValidation
