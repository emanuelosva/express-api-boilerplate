const { Router } = require('express')
const { auth, requestValidation, limiter } = require('../../middleware')
const validators = require('./requestSchema')
const userController = require('./controller')

const router = Router()

const MAX_REQUEST_PER_MIN_IN_AUTH = 4
router.use(limiter())

router.post(
  '/superadmin',
  auth.IsAuthenticated, auth.IsSuperAdmin,
  requestValidation(validators.signupValidator),
  userController.createSuperAdmin,
)

router.post(
  '/admin',
  auth.IsAuthenticated, auth.IsAdmin,
  requestValidation(validators.signupValidator),
  userController.createAdmin,
)

router.post(
  '/',
  auth.IsAuthenticated, auth.IsAdmin,
  requestValidation(validators.signupValidator),
  userController.insert,
)

router.post(
  '/signup',
  limiter(MAX_REQUEST_PER_MIN_IN_AUTH),
  requestValidation(validators.signupValidator),
  userController.signup,
)

router.post(
  '/verify',
  limiter(MAX_REQUEST_PER_MIN_IN_AUTH),
  requestValidation(validators.verifyValidator),
  userController.verifyAccount,
)

router.post(
  '/login',
  limiter(MAX_REQUEST_PER_MIN_IN_AUTH),
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
