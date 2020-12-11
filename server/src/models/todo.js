const mongoose = require('mongoose')
const { createId } = require('./id')

const Schema = mongoose.Schema

const TodoSchema = new Schema({
  name: String,
  description: String,
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
})

TodoSchema.pre('save', function(next) {
  createId()
  next()
})

module.exports = mongoose.model('Todo', TodoSchema, 'todos')
