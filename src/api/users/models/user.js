/**
 * User model.
 * -----------
 *
 * A user entitie represents all real
 * persons that interact with application.
 * A User can be an Admin, SuperAdmin or simple
 * user. By default the type `user` is defined.
 */

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { DB } = require('../../../db')
const { scopes } = require('../../../auth')
const { ApiError } = require('../../../lib')

const Schema = mongoose.Schema

/**
 * Schema
 */
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  lastname: { type: String, default: '', trim: true },
  phoneNumber: { type: String, default: '', trim: true },
  picture: { type: String, default: '' },
  biography: { type: String, default: '' },
  isActive: { type: Boolean, default: false },
  type: { type: String, enum: Object.values(scopes), default: scopes.USER },
}, {
  id: true,
  timestamps: true,
  toObject: {
    virtuals: true,
    getters: true,
  },
  toJSON: {
    virtuals: true,
    getters: true,
    transform: function(doc, ret) {
      delete ret.password
      delete ret._id
      delete ret.__v
    },
  },
})

/**
 * Indexes
 */
UserSchema.index({ email: 1 })

/**
 * Virtuals
 */
UserSchema.virtual('fullName').get(function() {
  return this.name + ' ' + this.lastname
})

/**
 * Methods
 */
UserSchema.methods.comparePassword = async function(rawPassword) {
  const match = await bcrypt.compare(rawPassword, this.password)
  return match
}

/**
 * Middlewares
 */
UserSchema.pre('save', async function(next) {
  try {
    if (this.isModified('password')) {
      const saltRounds = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(this.password, saltRounds)
      this.password = hash
    }
    if (this.isModified('email')) {
      const emailExists = await DB.db.collection('users').findOne({ email: this.email })
      if (emailExists) ApiError.raise.conflict('email already exists')
    }
    next()
  } catch (error) {
    next(error)
  }
})

UserSchema.post('deleteOne', async function(next) {
  try {
    await DB.db.collection('todos').deleteMany({ user: String(this._id) })
  } catch (error) {
    next(error)
  }
})

module.exports.User = mongoose.model('User', UserSchema)
