/**
 * Users router.
 * -------------
 *
 * Handle all user endpoints.
 */

const { Router } = require('express')
const UserController = require('./controller')
const validators = require('./requestSchema')
const { Auth, requestValidation, limiter } = require('../../middleware')
const { scopes } = require('../../auth')

module.exports = (ApiRouter, prefix) => {
  const router = Router()
  ApiRouter.use(`/${prefix}/users`, router)

  const MAX_REQUEST_PER_MIN_IN_SIGNUP = 4
  const MAX_REQUEST_PER_MIN_IN_LOGIN = 10
  const userController = new UserController()

  router.post(
    '/superadmin',
    Auth.isAuthenticated(), Auth.isAuthorized(scopes.SUPER_ADMIN),
    requestValidation(validators.signupValidator),
    userController.createSuperAdmin,
  )

  router.post(
    '/admin',
    Auth.isAuthenticated, Auth.isAuthorized(scopes.SUPER_ADMIN),
    requestValidation(validators.signupValidator),
    userController.createAdmin,
  )

  router.post(
    '/',
    Auth.isAuthenticated(), Auth.isAuthorized(scopes.ADMIN, scopes.SUPER_ADMIN),
    requestValidation(validators.signupValidator),
    userController.insert,
  )

  router.post(
    '/signup',
    limiter(MAX_REQUEST_PER_MIN_IN_SIGNUP),
    requestValidation(validators.signupVLOGINor), requestValidation(validators.signupValidator),
    userController.signup,
  )

  router.post(
    '/verify',
    limiter(MAX_REQUEST_PER_MIN_IN_SIGNUP),
    requestValidation(validators.verifyVLOGINor), requestValidation(validators.verifyValidator),
    userController.confirmAccount,
  )

  router.post(
    '/login',
    limiter(MAX_REQUEST_PER_MIN_IN_LOGIN),
    requestValidation(validators.loginVLOGINor), requestValidation(validators.loginValidator),
    userController.login,
  )

  router.post(
    '/refresh-token',
    limiter(MAX_REQUEST_PER_MIN_IN_SIGNUP),
    requestValidation(validators.refreshValidator),
    userController.refreshToken,
  )

  router.get(
    '/',
    Auth.isAuthenticated(), Auth.isAuthorized(scopes.ADMIN, scopes.SUPER_ADMIN),
    requestValidation(validators.getAllValidator),
    userController.list,
  )

  router.get(
    '/:id',
    Auth.isAuthenticated(), Auth.isOwnerOrAdmin(),
    requestValidation(validators.getOneValidator),
    userController.retrieve,
  )

  router.put(
    '/:id',
    Auth.isAuthenticated(), Auth.isOwnerOrSuperAdmin(),
    requestValidation(validators.updateValidator),
    userController.update,
  )

  router.patch(
    '/:id',
    Auth.isAuthenticated(), Auth.isOwnerOrSuperAdmin(),
    requestValidation(validators.patchValidator),
    userController.update,
  )

  router.delete(
    '/:id',
    Auth.isAuthenticated(), Auth.isOwnerOrSuperAdmin(),
    requestValidation(validators.deleteValidator),
    userController.delete,
  )
}
