const { body, query, param } = require('express-validator')

const idSchema = () => param('id')
  .isMongoId().withMessage('<id> must be a valid ID')

const emailSchema = () => body('email')
  .isEmail().withMessage('<email> must be a valid email')
  .isLength({ min: 4, max: 250 }).withMessage('<email> have a length between 4 to 250 chars')
  .normalizeEmail()

const passwordSchema = () => body('password')
  .matches(/[a-zA-Z0-9].{6,80}/).withMessage('<password> must check the pattern: /[a-zA-Z0-9].{6,80}/')

const phoneNumberSchema = () => body('phoneNumber')
  .isMobilePhone('any').withMessage('<phoneNumber> must be a valid number with E.164 schema')
  .trim()

const nameSchema = () => body('name')
  .isAlpha().withMessage('<name> must be ascii alpha')
  .trim()
  .isLength({ min: 2, max: 120 }).withMessage('<name> must have a length min=2, max=120')

const lastnameSchema = () => body('lastname')
  .isAlpha().withMessage('<lastname> must be ascii alpha')
  .trim()
  .isLength({ min: 2, max: 120 }).withMessage('<lastname> must have a length min=2, max=120')

const pictureSchema = () => body('picture')
  .isString().withMessage('<picture> must be url or base64 image')

const biographySchema = () => body('biography')
  .isString().withMessage('<biography> must be a valid text')
  .isLength({ max: 500 }).withMessage('<biography> must have a max length of 500')

const refreshTokenSchema = () => body('refreshToken')
  .isString().withMessage('<refreshToken> enter a valid token')

exports.signupValidator = [
  emailSchema().exists().withMessage('<email> is required'),
  passwordSchema().exists().withMessage('<password> is required'),
  phoneNumberSchema().exists().withMessage('<phoneNumber> is required'),
  nameSchema().exists().withMessage('<name> is required'),
  lastnameSchema().optional(),
]

exports.loginValidator = [
  emailSchema().exists().withMessage('<email> is required'),
  passwordSchema().optional().withMessage('<password> is required'),
]

exports.refreshValidator = [
  emailSchema().exists().withMessage('<email> is required'),
  refreshTokenSchema().exists().withMessage('<refreshToken> is required'),
]

exports.getOneValidator = [
  idSchema().exists().withMessage('<id> is required'),
]

exports.getAllValidator = [
  query('limit')
    .optional()
    .isNumeric().withMessage('<limit> must be a number')
    .toInt()
    .isLength({ min: 1, max: 200 }).withMessage('<limit> must be between 1 to 200'),
  query('skip')
    .optional()
    .isNumeric().withMessage('<limit> must be a number')
    .toInt(),
]

exports.updateValidator = [
  idSchema().exists().withMessage('<id> is required'),
  emailSchema().exists().withMessage('<email> is required'),
  passwordSchema().optional(),
  phoneNumberSchema().exists().withMessage('<phoneNumber> is required'),
  nameSchema().exists().withMessage('<name> is required'),
  lastnameSchema().exists().withMessage('<lastname> is required'),
  pictureSchema().exists().withMessage('<picture> is required'),
  biographySchema().exists().withMessage('<biography> is required'),
]

exports.patchValidator = [
  idSchema().exists().withMessage('<id> is required'),
  emailSchema().optional(),
  passwordSchema().optional(),
  phoneNumberSchema().optional(),
  nameSchema().optional(),
  lastnameSchema().optional(),
  pictureSchema().optional(),
  biographySchema().optional(),
]

exports.deleteValidator = [
  idSchema().exists().withMessage('<id> is required'),
]
