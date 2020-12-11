const Joi = require('joi')

const nameSchema = Joi.string()
const descriptionSchema = Joi.string()

exports.insertValidator = Joi.object({
  query: {},
  params: {},
  body: {
    name: nameSchema.required(),
    description: descriptionSchema,
  },
})

exports.getAllValidator = Joi.object({
  query: {
    user: Joi.string().required(),
  },
  params: {},
  body: {},
})

exports.getOneValidator = Joi.object({
  query: {},
  params: {
    id: Joi.string().required(),
  },
  body: {},
})

exports.updateValidator = Joi.object({
  query: {},
  params: {
    id: Joi.string().required(),
  },
  body: {
    name: nameSchema.required(),
    description: descriptionSchema.required(),
  },
})

exports.patchValidator = Joi.object({
  query: {},
  params: {
    id: Joi.string().required(),
  },
  body: {
    name: nameSchema,
    description: descriptionSchema,
  },
})

exports.deleteValidator = Joi.object({
  query: {},
  params: {
    id: Joi.string().required(),
  },
  body: {},
})
