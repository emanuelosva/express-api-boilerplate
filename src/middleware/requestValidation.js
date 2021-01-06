const { validationResult } = require('express-validator')
const { ApiError, Logger } = require('../lib')

const checkIfExtraFields = (validators, req) => {
  const requestInput = { ...req.query, ...req.params, ...req.body }

  const allowedFields = validators.reduce((fields, rule) => {
    return [...fields, [...rule.builder.fields]]
  }, [])
  allowedFields.forEach((key) => {
    if (requestInput[key]) requestInput[key] = null
  })
  const remainInputFields = Object.keys(requestInput).filter((key) => requestInput[key])
  if (!remainInputFields.length) {
    return null
  }

  Logger.warn(`${req.ip} try to make a invalid request`)
  ApiError.raise.badRequest(`[${remainInputFields}] not allowed`)
}

const requestValidation = (validators, allowExtraFields = false) => {
  return async (req, res, next) => {
    try {
      if (validators.length) {
        await Promise.all(validators.map((validator) => validator.run(req)))
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
          Logger.warn(`${req.ip} try to make a invalid request`)
          ApiError.raise.badRequest('bad request', errors.array())
        }

        if (!allowExtraFields) {
          checkIfExtraFields(validators, req)
        }
      }
      return next()
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = requestValidation
