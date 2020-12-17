const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TodoSchema = new Schema({
  id: String,
  name: String,
  description: String,
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
})

module.exports = mongoose.model('Todo', TodoSchema, 'todos')
