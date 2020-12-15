module.exports = {
  testEnvironment: 'node',
  testTimeout: 30000,
}
process.env = Object.assign(process.env, {
  NODE_ENV: 'test',
  MONOG_URL: 'mongodb://db:27017/test?retryWrites=true&w=majority',
})
