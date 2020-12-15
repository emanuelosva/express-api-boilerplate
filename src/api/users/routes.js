const { Router } = require('express')
const { auth, requestValidation } = require('../../middleware')
const userController = require('./controller')
const validators = require('./requestSchema')

const router = Router()

router.post(
  '/',
  requestValidation(validators.signupValidator),
  userController.insert,
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
  auth.IsAuthenticated, auth.IsAdmin,
  requestValidation(validators.getAllValidator),
  userController.getAll,
)

router.get(
  '/:id',
  auth.IsAuthenticated, auth.IsAccountOwnerOrAdmin,
  requestValidation(validators.getOneValidator),
  userController.getOne,
)

router.put(
  '/:id',
  auth.IsAuthenticated, auth.IsAccountOwnerOrAdmin,
  requestValidation(validators.updateValidator),
  userController.update,
)

router.patch(
  '/:id',
  auth.IsAuthenticated, auth.IsAccountOwnerOrAdmin,
  requestValidation(validators.patchValidator),
  userController.update,
)

router.delete(
  '/:id',
  auth.IsAuthenticated, auth.IsAccountOwnerOrSuperAdmin,
  requestValidation(validators.deleteValidator),
  userController.delete,
)

module.exports = router
