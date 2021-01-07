/**
 * Refresh Token model.
 * --------------------
 *
 * This entitie store a special token
 * with a relation one to many with a user.
 * This token provide the capacity to refresh
 * the JWT token to authorization.
 *
 * This token has a live time of 3 months
 * and can be mark as invalid to avoid security issues.
 */

const mongoose = require('mongoose')
const randToken = require('rand-token')
const { DB } = require('../../../db')

const Schema = mongoose.Schema

/**
 * Schema
 */
const RefreshTokenSchema = new Schema({
  token: { type: String, default: '', unique: true },
  email: { type: String, required: true },
  isInvalid: { type: Boolean, default: false },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: '90 days' },
  },
}, {
  timestamps: true,
  toObject: {
    virtuals: true,
    getters: true,
  },
  toJSON: {
    virtuals: true,
    getters: true,
  },
})

/**
 * Indexes
 */
RefreshTokenSchema.index({ token: 1, email: 1 })

/**
 * Virtuals
 */
RefreshTokenSchema.virtual('user').get(async function() {
  const associatedUser = await DB.db.collection('users').findOne({ email: this.email })
  associatedUser.id = String(associatedUser._id)
  return associatedUser
})

/**
 * Middlewares
 */
RefreshTokenSchema.pre('save', function(next) {
  if (!this.token) {
    this.token = randToken.uid(64)
  }
  next()
})

module.exports.RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema, 'refresh_tokens')
