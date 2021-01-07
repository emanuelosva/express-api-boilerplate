/**
 * Todo model.
 * -----------
 *
 * A todo entitie represents a task
 * to complete in a specific date.
 * All todos are related to one user with a
 * relation many to one
 */

const mongoose = require('mongoose')
const { sluglify } = require('../../utils/sluglify')

const { Schema } = mongoose

/**
 * Schema
 */
const TodoSchema = new Schema({
  user: { type: String, required: true, ref: 'User', index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  slug: String,
  completedDate: Date,
}, {
  id: true,
  timestamps: true,
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v
      delete ret._id
    },
  },
})

/**
 * Indexes
 */
TodoSchema.index({ slug: true })

/**
 * Middlewares
 */
TodoSchema.pre('save', function(next) {
  try {
    if (!this.slug) {
      this.slug = sluglify(this.title)
    }
  } catch (error) {
    next(error)
  }
})

module.exports.Todo = mongoose.model('Todo', TodoSchema)
