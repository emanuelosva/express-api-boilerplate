const response = require('../../response')
const UserService = require('./service')

const userService = new UserService()

exports.signup = (req, res, next) => {
  const userDTO = req.body
  userService.signup(userDTO)
    .then((data) => response.success(req, res, 201, data, 'User created'))
    .catch(next)
}

exports.login = (req, res, next) => {
  const { email, password } = req.body
  userService.login({ email, password })
    .then((data) => response.success(req, res, 200, data, 'User logged'))
    .catch(next)
}

exports.refreshToken = (req, res, next) => {
  const { email, refreshToken: token } = req.body
  userService.refreshToken({ email, token })
    .then((data) => response.success(req, res, 200, data, 'New token'))
    .catch(next)
}

exports.get = (req, res, next) => {
  const { user: { email } } = req
  userService.findByEmail(email)
    .then((data) => response.success(req, res, 200, data, 'User data'))
    .catch(next)
}

exports.update = (req, res, next) => {
  const { user: { _id }, body: userUpdateDTO } = req
  userService.update(_id, userUpdateDTO)
    .then((data) => response.success(req, res, 200, data, 'User updated'))
    .catch(next)
}

exports.delete = (req, res, next) => {
  const { user: { _id } } = req
  userService.delete(_id)
    .then((data) => response.success(req, res, 200, data, 'User deleted'))
    .catch(next)
}
