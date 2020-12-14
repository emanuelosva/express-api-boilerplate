const Joi = require('joi')

const emailSchema = Joi.string().email()
const passwordSchema = Joi.string().regex(/[a-zA-Z0-9].{6,80}/)
const phoneNumberSchema = Joi.string().regex(/^\+(?:[0-9]?).{9,15}[0-9]$/)
const nameSchema = Joi.string().min(2).max(80)
const refreshTokenSchema = Joi.string().token()

exports.signupValidator = Joi.object({
  params: {},
  query: {},
  body: {
    email: emailSchema.required(),
    password: passwordSchema.required(),
    phoneNumber: phoneNumberSchema.required(),
    name: nameSchema.required(),
    lastname: nameSchema.optional(),
  },
})

exports.loginValidator = Joi.object({
  params: {},
  query: {},
  body: {
    email: emailSchema.required(),
    password: passwordSchema.required(),
  },
})

exports.refreshValidator = Joi.object({
  params: {},
  query: {},
  body: {
    email: emailSchema.required(),
    refreshToken: refreshTokenSchema.required(),
  },
})

exports.getValidator = Joi.object({
  params: {},
  query: {},
  body: {},
})

exports.updateValidator = Joi.object({
  params: {},
  query: {},
  body: {
    email: emailSchema.required(),
    password: passwordSchema,
    phoneNumber: phoneNumberSchema.required(),
    name: nameSchema.required(),
    lastname: nameSchema.required(),
    picture: Joi.string().required(),
    biography: Joi.string().max(1024).required(),
  },
})

exports.patchValidator = Joi.object({
  params: {},
  query: {},
  body: {
    email: emailSchema.optional(),
    password: passwordSchema.optional(),
    phoneNumber: phoneNumberSchema.optional(),
    name: nameSchema.optional(),
    lastname: nameSchema.optional(),
    picture: Joi.string().optional(),
    biography: Joi.string().max(1024).optional(),
  },
})

exports.deleteValidator = Joi.object({
  params: {},
  query: {},
  body: {},
})
