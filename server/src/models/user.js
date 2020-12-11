const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { scopes } = require('../auth')
const { ApiError } = require('../lib')
const { createId } = require('./id')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  id: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  lastname: { type: String, default: '' },
  phoneNumber: { type: String, required: true },
  picture: { type: String, default: '' },
  biography: { type: String, default: '' },
  type: { type: String, enum: Object.values(scopes), default: scopes.user },
  joinedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
})

UserSchema.index({ email: 1 })

UserSchema.pre('save', async function(next) {
  try {
    createId()
    if (this.isModified('password')) {
      const saltRounds = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(this.password, saltRounds)
      this.password = hash
    }
    if (this.isModified('email')) {
      const db = mongoose.connection.db
      const emailExists = await db.collection('users').findOne({ email: this.email })
      if (emailExists) ApiError.conflict('email already exists')
    }
    next()
  } catch (error) {
    next(error)
  }
})

UserSchema.methods.comparePassword = async function(rawPassword) {
  try {
    const match = await bcrypt.compare(rawPassword, this.password)
    return match
  } catch (error) {
    return false
  }
}

module.exports = mongoose.model('User', UserSchema, 'users')
