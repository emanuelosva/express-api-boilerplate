const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  lastname: { type: String, default: '' },
  phoneNumber: { type: String, required: true },
  picture: { type: String, default: '' },
  biography: { type: String, default: '' },
  joinedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
})

UserSchema.index({ email: 1 })

UserSchema.pre('save', async function(next) {
  try {
    if (this.isModified('password')) {
      const saltRounds = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(this.password, saltRounds)
      this.password = hash
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
