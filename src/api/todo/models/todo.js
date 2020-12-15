const mongoose = require('mongoose')
const { createModelId } = require('../../../lib')

const Schema = mongoose.Schema

const TodoSchema = new Schema({
  id: String,
  name: String,
  description: String,
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
})

TodoSchema.pre('save', function(next) {
  createModelId.bind(this)
  next()
})

module.exports = mongoose.model('Todo', TodoSchema, 'todos')
