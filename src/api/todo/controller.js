/**
 * Todo controller.
 * ----------------
 *
 * This class handle all request to resources
 * directly related with Todo entitie.
 */

const TodoService = require('./service')
const { Todo } = require('./model')
const { Controller } = require('../../core')

class TodoController extends Controller {
  constructor(service = new TodoService(Todo)) {
    super(service, {
      name: 'todo',
      queryField: 'id',
      queryIn: 'params',
      addUserOnCreate: true,
    })
  }
}

module.exports = TodoController
