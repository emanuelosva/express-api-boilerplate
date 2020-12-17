const { Router } = require('express')
const { auth, requestValidation } = require('../../middleware')
const todoController = require('./controller')
const validators = require('./requestSchema')

const router = Router()

router.post(
  '/',
  auth.IsAuthenticated, auth.IsAccountOwner,
  requestValidation(validators.insertValidator),
  todoController.insert,
)

router.get(
  '/',
  auth.IsAuthenticated, auth.IsAccountOwnerOrAdmin,
  requestValidation(validators.getAllValidator),
  todoController.getAll,
)

router.get(
  '/:id',
  auth.IsAuthenticated, auth.IsAccountOwnerOrAdmin,
  requestValidation(validators.getOneValidator),
  todoController.getOne,
)

router.put(
  '/:id',
  auth.IsAuthenticated, auth.IsAccountOwner,
  requestValidation(validators.updateValidator),
  todoController.update,
)

router.patch(
  '/:id',
  auth.IsAuthenticated, auth.IsAccountOwner,
  requestValidation(validators.patchValidator),
  todoController.update,
)

router.delete(
  '/:id',
  auth.IsAuthenticated, auth.IsAccountOwner,
  requestValidation(validators.deleteValidator),
  todoController.delete,
)

module.exports = router