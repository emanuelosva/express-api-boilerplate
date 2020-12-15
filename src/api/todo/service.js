const { Todo } = require('./models')
const { Service } = require('../../core')

class TodoService extends Service {
  constructor(todoODM = Todo) {
    super(todoODM)
  }
}

module.exports = TodoService
