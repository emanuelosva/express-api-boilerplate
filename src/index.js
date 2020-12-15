const app = require('./app')
const config = require('./config')
const { ApiError, logger } = require('./lib')

const { app: { PORT } } = config

process.on('unhandledRejection', async (err) => {
  await ApiError.handleError(err)
})

app.listen(PORT, async (err) => {
  if (err) await ApiError.handleError(err)
  logger.info('Server running 🚀')
})
