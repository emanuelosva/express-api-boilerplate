const { Router } = require('express')
const userController = require('./controller')
const validators = require('./rquestSchema')
const { authenticate, requestValidation } = require('../../middleware')

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
  userController.refreshToken,
)

router.get(
  '/',
  authenticate(),
  userController.get,
)

router.put(
  '/',
  authenticate(),
  requestValidation(validators.updateValidator),
  userController.update,
)

router.delete(
  '/',
  authenticate(),
  userController.delete,
)

module.exports = router
