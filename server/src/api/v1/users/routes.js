const { Router } = require('express')
const { authenticate, requestValidation } = require('../../../middleware')
const userController = require('./controller')
const validators = require('./rquestSchema')

const router = Router()

router.post(
  '/signup',
  requestValidation(validators.signupValidator),
  userController.signup,
)

router.post(
  '/login',
  requestValidation(validators.loginValidator),
  userController.login,
)

router.post(
  '/refresh-token',
  requestValidation(validators.refreshValidator),
  userController.refreshToken,
)

router.get(
  '/',
  authenticate(),
  requestValidation(validators.getValidator),
  userController.getOne,
)

router.put(
  '/',
  authenticate(),
  requestValidation(validators.updateValidator),
  userController.update,
)

router.patch(
  '/',
  authenticate(),
  requestValidation(validators.patchValidator),
  userController.update,
)

router.delete(
  '/',
  authenticate(),
  requestValidation(validators.deleteValidator),
  userController.delete,
)

module.exports = router
