module.exports = {
  testEnvironment: 'node',
  testTimeout: 30000
}
process.env = Object.assign(process.env, {
  NODE_ENV: 'test',
  MONGODB: 'mongodb://mongo:mongo/test?retryWrites=true&w=majority'
})
