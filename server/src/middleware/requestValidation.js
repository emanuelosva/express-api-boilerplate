const { validationResult } = require('express-validator')
const { ApiError, httpCode, logger } = require('../lib')

const checkIfExtraFields = (validators, req) => {
  const requestInput = { ...req.query, ...req.params, ...req.body }
  const allowedFields = validators.reduce((fields, rule) => {
    return [...fields, [...rule.builder.fields]]
  }, [])

  allowedFields.forEach((key) => {
    if (requestInput[key]) requestInput[key] = null
  })
  const remainInputFields = Object.keys(requestInput).filter(key => requestInput[key])
  if (!remainInputFields.length) {
    return null
  }
  logger.error(`${req.ip} try to make a invalid request`)
  ApiError.badRequest(`[${remainInputFields}] not allowed`)
}

const requestValidation = (validators, allowExtraFields = false) => {
  return async (req, res, next) => {
    if (validators.length) {
      await Promise.all(validators.map((validator) => validator.run(req)))
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        logger.error(`${req.ip} try to make a invalid request`)
        return next(new ApiError(httpCode.status.badRequest, '', false, errors.array()))
      }
    }
    if (!allowExtraFields) {
      try {
        checkIfExtraFields(validators, req)
      } catch (error) {
        return next(error)
      }
    }
    return next()
  }
}

module.exports = requestValidation
