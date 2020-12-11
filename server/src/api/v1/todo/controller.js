const TodoService = require('./service')
const { Todo } = require('./models')
const { Controller, response } = require('../../../core')

const todoService = new TodoService(Todo)

class TodoController extends Controller {
  constructor(service = todoService) {
    super(service, 'todo')
  }

  async insert(req, res, next) {
    try {
      const { user: { _id }, body: todoDTO } = req
      const data = await this.service.insert({ user: _id, ...todoDTO })
      return response.success(req, res, 201, data, 'todo created')
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = new TodoController(todoService)
