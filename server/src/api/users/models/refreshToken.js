const randToken = require('rand-token')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RefreshTokenSchema = new Schema({
  token: { type: String, default: '' },
  email: { type: String, required: true },
  isValid: { type: Boolean, default: true },
})

RefreshTokenSchema.index({ token: 1 })

RefreshTokenSchema.pre('save', function(next) {
  if (!this.token) {
    this.token = randToken.uid(128)
  }
  next()
})

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema, 'refreshTokens')