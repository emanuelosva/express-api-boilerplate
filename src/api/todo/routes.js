const { Router } = require('express')
const { auth, requestValidation, limiter } = require('../../middleware')
const todoController = require('./controller')
const validators = require('./requestSchema')

const router = Router()

const MAX_REQUEST_PER_MINUTE = 60
router.use(limiter(MAX_REQUEST_PER_MINUTE))

router.post(
  '/',
  auth.IsAuthenticated,
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
  auth.IsAuthenticated,
  requestValidation(validators.getOneValidator),
  todoController.getOne,
)

router.put(
  '/:id',
  auth.IsAuthenticated,
  requestValidation(validators.updateValidator),
  todoController.update,
)

router.patch(
  '/:id',
  auth.IsAuthenticated,
  requestValidation(validators.patchValidator),
  todoController.update,
)

router.delete(
  '/:id',
  auth.IsAuthenticated,
  requestValidation(validators.deleteValidator),
  todoController.delete,
)

module.exports = router
