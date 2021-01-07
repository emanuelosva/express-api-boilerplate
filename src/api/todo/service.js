/**
 * Todo service.
 * -------------
 *
 * This class handle all bussines logic
 * directly related with Todo entitie.
 */

const { Todo } = require('./models')
const { Service } = require('../../core')
const { Cache } = require('../../services/cache')

class TodoService extends Service {
  constructor(model = Todo) {
    super(model, {
      cache: new Cache('todos'),
      name: 'todo',
      checkIfUserHasAccess: true,
      ownerFieldOnItem: 'user',
    })
  }
}

module.exports = TodoService
