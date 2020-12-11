const { Router } = require('express')
const { authenticate, requestValidation } = require('../../../middleware')
const todoController = require('./controller')
const validators = require('./requestSchema')

const router = Router()

router.post(
  '/',
  authenticate(),
  requestValidation(validators.insertValidator),
  todoController.insert,
)

router.get(
  '/',
  authenticate(),
  requestValidation(validators.getAllValidator),
  todoController.getAll,
)

router.get(
  '/:id',
  authenticate(),
  requestValidation(validators.getOneValidator),
  todoController.getOne,
)

router.put(
  '/:id',
  authenticate(),
  requestValidation(validators.updateValidator),
  todoController.update,
)

router.patch(
  '/:id',
  authenticate(),
  requestValidation(validators.patchValidator),
  todoController.update,
)

router.delete(
  '/:id',
  authenticate(),
  requestValidation(validators.deleteValidator),
  todoController.delete,
)

module.exports = router
