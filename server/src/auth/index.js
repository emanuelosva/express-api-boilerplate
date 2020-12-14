const scopes = require('./scopes')
const jwt = require('./jwt')
const tokenTypes = require('./tokenTypes')

const createToken = async (
  email,
  scope = scopes.user,
  type = tokenTypes.auth,
) => jwt.sign({ email, scope, type })

module.exports = {
  scopes,
  jwt,
  createToken,
  tokenTypes,
}
