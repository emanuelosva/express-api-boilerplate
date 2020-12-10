const { ApiError, httpCode } = require('../lib')

const schemaValidation = async (joiSchema, req) => {
  const { body, query, params } = req
  const requestInput = { body, query, params }
  try {
    await joiSchema.validateAsync(requestInput, { abortEarly: false })
  } catch (error) {
    return error
  }
}

const requestValidation = (joiSchema) => async (req, res, next) => {
  const error = await schemaValidation(joiSchema, req)

  if (!error) return next()
  const errors = error.details.map((e) => e.message)
  next(new ApiError(httpCode.status.badRequest, '', false, errors))
}

module.exports = requestValidation
