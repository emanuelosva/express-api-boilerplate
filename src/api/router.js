const { Router } = require('express')
const UserRoutes = require('./users/routes')
const TodoRoutes = require('./todo/routes')

const router = Router()

router.use('/users', UserRoutes)
router.use('/todos', TodoRoutes)

module.exports = router
