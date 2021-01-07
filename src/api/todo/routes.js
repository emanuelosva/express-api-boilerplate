/**
 * Todo router.
 * ------------
 *
 * Handle all todo endpoints.
 */

const { Router } = require('express')
const TodoController = require('./controller')
const validators = require('./requestSchema')
const { Auth, requestValidation, limiter } = require('../../middleware')
const { scopes } = require('../../auth')

module.exports = (ApiRouter, prefix) => {
  const router = Router()
  ApiRouter.use(`/${prefix}`, router)

  const MAX_REQUEST_PER_MINUTE = 60
  const todoController = new TodoController()

  router.use(limiter(MAX_REQUEST_PER_MINUTE))

  router.post(
    '/',
    Auth.isAuthenticated(),
    requestValidation(validators.insertValidator),
    todoController.insert,
  )

  router.get(
    '/',
    Auth.isAuthenticated(), Auth.isAuthorized(scopes.ADMIN, scopes.SUPER_ADMIN),
    requestValidation(validators.getAllValidator),
    todoController.list,
  )

  router.get(
    '/:id',
    Auth.isAuthenticated(),
    requestValidation(validators.getOneValidator),
    todoController.retrieve,
  )

  router.put(
    '/:id',
    Auth.isAuthenticated(),
    requestValidation(validators.updateValidator),
    todoController.update,
  )

  router.patch(
    '/:id',
    Auth.isAuthenticated(),
    requestValidation(validators.patchValidator),
    todoController.update,
  )

  router.delete(
    '/:id',
    Auth.isAuthenticated(),
    requestValidation(validators.deleteValidator),
    todoController.delete,
  )
}
