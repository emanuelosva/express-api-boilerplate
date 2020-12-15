const { body, query, param } = require('express-validator')

const userQuerySchema = () => query('user')
  .isMongoId().withMessage('<id> must be a valid ID')

const idSchema = () => param('id')
  .isMongoId().withMessage('<id> must be a valid ID')

const nameSchema = () => body('name')
  .isString().withMessage('<name> must be a trsing')
  .isLength({ min: 1, max: 80 }).withMessage('<name> must have a max length of 80')
  .trim()

const descriptionSchema = () => body('description')
  .isString().withMessage('<name> must be a trsing')
  .isLength({ min: 1, max: 500 }).withMessage('<description> must have a max length of 80')

exports.insertValidator = [
  nameSchema().exists().withMessage('<name> is required'),
  descriptionSchema().exists().withMessage('<description> is required'),
]

exports.getAllValidator = [
  query('limit')
    .optional()
    .isNumeric().withMessage('<limit> must be a number')
    .toInt()
    .isLength({ min: 1, max: 200 }).withMessage('<limit> must be between 1 to 200'),
  query('skip')
    .exists()
    .isNumeric().withMessage('<limit> must be a number')
    .toInt(),
  userQuerySchema().exists().withMessage('<user> is required'),
]

exports.getOneValidator = [
  idSchema().exists().withMessage('<id> is required'),
]

exports.updateValidator = [
  idSchema().exists().withMessage('<id> is required'),
  nameSchema().exists().withMessage('<name> is required'),
  descriptionSchema().exists().withMessage('<description> is required'),
]

exports.patchValidator = [
  idSchema().exists().withMessage('<id> is required'),
  nameSchema().optional(),
  descriptionSchema().optional(),
]

exports.deleteValidator = [
  idSchema().exists().withMessage('<id> is required'),
]
