const { Todo } = require('./models')
const { Service, Cache } = require('../../core')

class TodoService extends Service {
  constructor(todoODM = Todo) {
    super(todoODM, new Cache(), { name: 'todo' })
  }
}

module.exports = TodoService
